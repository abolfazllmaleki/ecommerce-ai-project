import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { rateProduct } from '@/services/rating';

interface StarRatingProps {
  userId: string;
  productId: string;
  initialRating: number;
  onRatingUpdate?: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ userId, productId, initialRating, onRatingUpdate }) => {
  const [userRating, setUserRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRating = async (newRating: number) => {
    try {
      // Optimistic update
      const previousRating = userRating;
      setUserRating(newRating);
  
      const response = await fetch(`http://localhost:3000/users/user/${userId}/ratings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // افزودن توکن
        },
        body: JSON.stringify({
          productId,
          rating: newRating,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating');
      }
  
      if (onRatingUpdate) onRatingUpdate(newRating);
    } catch (err) {
      console.error('Failed to rate product:', err);
      setUserRating(0); // بازگرداندن مقدار قبلی
      alert('امتیازدهی ناموفق بود. لطفا دوباره تلاش کنید');
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="focus:outline-none"
        >
          <FaStar
            className={`text-xl transition duration-200 ${
              star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
