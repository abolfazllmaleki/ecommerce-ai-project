import { useState } from 'react';
import Image from 'next/image';
import DynamicImage from '../DynamicImage/DynamicImage';
interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string>(images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-2">
        {images
          .filter((image) => image !== mainImage) // Exclude the main image from thumbnails
          .slice(0, 3) // Limit to 3 thumbnails (total of 4 images including the main image)
          .map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 relative cursor-pointer group"
              onClick={() => setMainImage(image)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg border border-gray-200"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity"></div>
            </div>
          ))}
      </div>

      {/* Main Image */}
      <div className="flex-1">
        <DynamicImage imageUrl={mainImage} altText="Main Product Image" />
      </div>
    </div>
  );
};

export default ImageGallery;