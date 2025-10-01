'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="flex flex-col">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 mb-4">
        <Image
          src={images[activeImage]}
          alt={productName}
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`aspect-square overflow-hidden rounded-xl bg-gray-100 border-2 transition-all ${
              index === activeImage 
                ? 'border-blue-500 scale-105' 
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} view ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;