from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from lightfm import LightFM
from lightfm.data import Dataset
from datetime import datetime
import os

app = FastAPI()

# اتصال به MongoDB
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["recommendation_db"]

# -------------------- توابع کمکی --------------------
def get_user_data(user_id: str):
    user = db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_product_data(product_id: str):
    product = db.products.find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# -------------------- پیش‌پردازش داده‌ها --------------------
def prepare_data():
    # جمع‌آوری داده‌ها از MongoDB
    users = list(db.users.find({}))
    products = list(db.products.find({}))
    
    # تبدیل به DataFrame
    users_df = pd.DataFrame(users)
    products_df = pd.DataFrame(products)
    
    # ترکیب ویژگی‌های محصول
    products_df['combined_features'] = (
        products_df['category'] + ' ' +
        products_df['description'] + ' ' +
        products_df['tags'].apply(lambda x: ' '.join(x)) + ' ' +
        products_df['brand']
    )
    
    return users_df, products_df

# -------------------- مدل پیشنهاددهنده --------------------
class RecommendationModel:
    def __init__(self):
        self.dataset = None
        self.model = LightFM(loss='warp')
        self.product_features = None
        self.tfidf_vectorizer = TfidfVectorizer()
        self.content_similarity = None
        
    def train(self):
        # آماده‌سازی داده‌ها
        users_df, products_df = prepare_data()
        
        # ساخت مدل مبتنی بر محتوا
        self.product_features = self.tfidf_vectorizer.fit_transform(products_df['combined_features'])
        self.content_similarity = cosine_similarity(self.product_features)
        
        # ساخت مدل Collaborative Filtering
        self.dataset = Dataset()
        self.dataset.fit(
            users=(user['_id'] for user in users_df.to_dict('records')),
            items=(product['_id'] for product in products_df.to_dict('records')),
            item_features=self.tfidf_vectorizer.get_feature_names_out()
        )
        
        # ساخت تعاملات از بازدیدها و امتیازها
        interactions = []
        for user in users_df.to_dict('records'):
            for view in user.get('interactionHistory', []):
                if view['type'] == 'view':
                    interactions.append((user['_id'], view['product_id'], 1))
            for rating in user.get('ratings', []):
                interactions.append((user['_id'], rating['product_id'], rating['value']))
        
        # ساخت ماتریس تعاملات
        (interactions_matrix, _) = self.dataset.build_interactions(interactions)
        
        # آموزش مدل
        self.model.fit(interactions_matrix, item_features=self.product_features, epochs=30)

    def hybrid_recommendations(self, user_id: str, num_items: int = 5):
        try:
            # پیشنهادات Collaborative Filtering
            user_internal_id = self.dataset.mapping()[0][user_id]
            scores = self.model.predict(user_internal_id, list(self.dataset.mapping()[2].values()))
            
            # پیشنهادات Content-Based
            user = get_user_data(user_id)
            last_viewed = [i['product_id'] for i in user.get('interactionHistory', [])[-3:] if i['type'] == 'view']
            content_scores = []
            if last_viewed:
                for product_id in last_viewed:
                    idx = list(self.dataset.mapping()[2].keys()).index(product_id)
                    content_scores.append(self.content_similarity[idx])
                content_scores = np.mean(content_scores, axis=0)
                scores += content_scores * 0.5  # ترکیب وزن‌دار
            
            # انتخاب بهترین پیشنهادات
            top_indices = np.argsort(-scores)[:num_items]
            return [list(self.dataset.mapping()[2].keys())[i] for i in top_indices]
        
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return []

# -------------------- API Endpoints --------------------
model = RecommendationModel()

@app.on_event("startup")
async def startup_event():
    model.train()

@app.get("/products/{product_id}")
async def get_product(product_id: str):
    product = get_product_data(product_id)
    
    # افزایش تعداد بازدیدها
    db.products.update_one(
        {"_id": product_id},
        {"$inc": {"views": 1}}
    )
    
    # پیشنهادات مرتبط
    recommendations = model.hybrid_recommendations("current_user_id")  # باید با سیستم احراز هویت ادغام شود
    
    return {
        "product": product,
        "recommendations": [get_product_data(pid) for pid in recommendations[:5]]
    }

@app.post("/users/{user_id}/view/{product_id}")
async def log_view(user_id: str, product_id: str):
    # ثبت بازدید در تاریخچه کاربر
    db.users.update_one(
        {"_id": user_id},
        {"$push": {
            "interactionHistory": {
                "type": "view",
                "product_id": product_id,
                "timestamp": datetime.now()
            }
        }}
    )
    
    return {"message": "View logged successfully"}

@app.get("/recommend/{user_id}")
async def get_recommendations(user_id: str):
    recommendations = model.hybrid_recommendations(user_id)
    return [get_product_data(pid) for pid in recommendations]

# -------------------- اجرای برنامه --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
