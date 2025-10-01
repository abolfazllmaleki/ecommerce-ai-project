import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';

interface ItemCardProps {
  id: string;
  image: string;
  name: string;
  currentPrice: number;
  originalPrice?: number;
  label?: string;
  rating?: number;
  reviews?: number;
  actions?: React.ReactNode;
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  image,
  name,
  currentPrice,
  originalPrice,
  label,
  rating,
  reviews,
  actions,
}) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Label badge with improved styling */}
      {label && (
        <span className={`absolute top-3 left-3 z-10 text-white text-xs font-semibold px-2.5 py-1 rounded-full 
          ${label === 'NEW' ? 'bg-green-500' : 'bg-red-500'} shadow-md`}>
          {label}
        </span>
      )}

      {/* Action buttons with hover effects */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors">
          <FiHeart className="w-4 h-4" />
        </button>
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors">
          <FiEye className="w-4 h-4" />
        </button>
      </div>

      <Link href={`/ProductDetail/${id}`} className="block">
        {/* Image container with improved hover effect */}
        <div className="relative h-60 bg-gray-50 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, 33vw"
            quality={85}
          />
          {/* Overlay for quick add to cart */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg hover:bg-gray-800 hover:text-white transition-all">
              <FiShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </Link>

      {/* Product info with improved typography */}
      <div className="p-4">
        <Link href={`/ProductDetail/${id}`}>
          <h3 className="text-sm font-semibold text-gray-800 mb-2 hover:text-red-500 transition-colors line-clamp-2" style={{ minHeight: '2.5rem' }}>
            {name}
          </h3>
        </Link>
        
        {/* Price with better visual hierarchy */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-red-600">
            ${currentPrice.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating with improved stars */}
        {rating && reviews && (
          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.floor(rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-gray-500 text-xs">({reviews})</span>
            {originalPrice && (
              <span className="ml-auto text-xs font-medium text-green-600">
                {Math.round((1 - currentPrice / originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
