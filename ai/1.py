from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
import numpy as np
import pandas as pd
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
from typing import List
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

client = MongoClient("mongodb://localhost:27017/")
db = client["shop"]

app = FastAPI()

def prepare_data():
    users = list(db.users.find({}))
    products = list(db.products.find({}))

    for user in users:
        user['_id'] = str(user['_id'])

    for product in products:
        product['_id'] = str(product['_id'])

    products_df = pd.DataFrame(products) if products else pd.DataFrame(columns=["_id", "category", "description", "brand", "tags"])
    users_df = pd.DataFrame(users) if users else pd.DataFrame(columns=["_id", "ratings"])

    required_columns = ['category', 'description', 'brand', 'tags']
    for col in required_columns:
        if col not in products_df.columns:
            products_df[col] = ''

    products_df['tags'] = products_df['tags'].apply(lambda x: ' '.join(x) if isinstance(x, list) else ' ')
    products_df['combined_features'] = (
        products_df['category'] + ' ' +
        products_df['description'] + ' ' +
        products_df['brand'] + ' ' +
        products_df['tags']
    )

    return users_df, products_df

class RecommendationModel:
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(stop_words='english')
        self.product_similarity = None
        self.user_item_matrix = None
        self.svd = TruncatedSVD(n_components=20)
        self.product_ids = None

    def train(self):
        users_df, products_df = prepare_data()

        product_features = self.tfidf_vectorizer.fit_transform(products_df['combined_features'])
        self.product_similarity = cosine_similarity(product_features)
        self.product_ids = products_df['_id'].tolist()

        user_item_data = []
        for user in users_df.to_dict('records'):
            for rating in user.get('ratings', []):
                user_item_data.append((
                    user['_id'],
                    rating.get('product_id'),
                    rating.get('value', 0)
                ))

        user_item_df = pd.DataFrame(user_item_data, columns=["user_id", "product_id", "rating"])

        if not user_item_df.empty:
            self.user_item_matrix = user_item_df.pivot_table(
                index="user_id",
                columns="product_id",
                values="rating",
                fill_value=0
            )
            if not self.user_item_matrix.empty:
                user_factors = self.svd.fit_transform(self.user_item_matrix)
                product_factors = self.svd.components_
                self.svd_reconstructed = np.dot(user_factors, product_factors)
            else:
                self.svd_reconstructed = np.array([])

    def hybrid_recommendations(self, user_id: str, num_items: int = 5) -> List[str]:
        users_df, products_df = prepare_data()

        try:
            user = db.users.find_one({"_id": ObjectId(user_id)})
            if not user:
                return []
            user["_id"] = str(user["_id"])  
        except:
            return []

        scores_cb = np.zeros(len(products_df))
        
        if self.svd_reconstructed.size == 0 or len(self.svd_reconstructed.shape) < 2:
            scores_cf = np.zeros(len(products_df))
        else:
            scores_cf = self.svd_reconstructed[0]

        final_scores = scores_cf * 0.6 + scores_cb * 0.4
        top_indices = np.argsort(-final_scores)[:num_items]
        return [self.product_ids[i] for i in top_indices]

model = RecommendationModel()

@asynccontextmanager
async def lifespan(app: FastAPI):
    model.train()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
@app.get("/recommend/{user_id}")
async def get_recommendations(user_id: str):
    recommendations = model.hybrid_recommendations(user_id)
    return recommendations
