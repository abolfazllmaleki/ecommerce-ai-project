// components/SearchPage/ProductList.tsx
import ItemCard from "../ItemCard/ItemCard";
import { Product } from "../../types/types";

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const hasDiscount = product.discount > 0;
        const originalPrice = hasDiscount 
          ? Math.round(product.price * 100 / (100 - product.discount))
          : undefined;

        return (
          <ItemCard
            id={product._id}
            key={product._id}
            image={product.images[0]} // Use first image from array
            name={product.name}
            currentPrice={product.price}
            originalPrice={originalPrice}
            label={hasDiscount ? 'SALE' : product.tags?.[0]} // Use discount or first tag
            rating={product.rating}
            reviews={product.numberOfReviews} // Map numberOfReviews to reviews
          />
        );
      })}
    </div>
  );
};