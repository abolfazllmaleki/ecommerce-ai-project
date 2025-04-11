// components/ItemCard/ItemCard.tsx
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-lg">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10">{actions}</div>

      {/* Label badge */}
      {label && (
        <span className={`absolute top-2 left-2 z-10 text-white text-xs px-2 py-1 rounded 
          ${label === 'NEW' ? 'bg-green-500' : 'bg-red-500'}`}>
          {label}
        </span>
      )}

      <Link href={`http://localhost:3001/ProductDetail/${id}`}>
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`http://localhost:3001/ProductDetail/${id}`} className="hover:text-red-500">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 truncate">{name}</h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-red-600">
            ${currentPrice.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {rating && reviews && (
          <div className="flex items-center gap-1 text-sm">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(rating))}
              {'☆'.repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-gray-500">({reviews})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;