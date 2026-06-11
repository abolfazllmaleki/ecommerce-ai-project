
import ItemCard from "../ItemCard/ItemCard";
import { Product } from "../../types/types"; // <-- فقط Product را import کن

const normalizeProduct = (product: any): Product => {
  if (!product) return { name: "", description: "", category: {}, price: 0, stock: 0, colors: [], sizes: [], rating: 0, numberOfReviews: 0, images: [], discount: 0, Specifications: "", adminNote: "" };

  const normalized: Product = {
    ...product,
    _id: product?._id ?? product?.id ?? "",
    id: product?.id ?? product?._id ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? {},
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    colors: product?.colors ?? [],
    sizes: product?.sizes ?? [],
    rating: product?.rating ?? 0,
    numberOfReviews: product?.numberOfReviews ?? 0,
    images: product?.images ?? [],
    discount: product?.discount ?? 0,
    Specifications: product?.Specifications ?? "",
    adminNote: product?.adminNote ?? "",
  };

  if (!normalized.id && normalized._id) {
    normalized.id = normalized._id;
  }
  if (!normalized._id && normalized.id) {
    normalized._id = normalized.id;
  }

  return normalized;
};
// --- پایان تابع normalizeProduct ---


interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products: rawProducts }: ProductListProps) => {
  const normalizedProducts = rawProducts.map(product => normalizeProduct(product));

  if (normalizedProducts.length === 0) {
    return <div className="text-center py-12 text-gray-500">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {normalizedProducts.map((product) => {
        const hasDiscount = product.discount > 0;
        const currentPrice = product.price;
        const originalPrice = hasDiscount
          ? Math.round(currentPrice * 100 / (100 - product.discount))
          : undefined;

        return (
          <ItemCard
            id={product.id}
            key={product.id}
            image={product.images?.[0] ?? ""}
            name={product.name}
            currentPrice={currentPrice}
            originalPrice={originalPrice}
            label={hasDiscount ? 'SALE' : product.tags?.[0]}
            rating={product.rating}
            reviews={product.numberOfReviews}
          />
        );
      })}
    </div>
  );
};
