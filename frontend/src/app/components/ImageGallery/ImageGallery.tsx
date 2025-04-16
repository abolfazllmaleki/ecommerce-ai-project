'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicImage from '../DynamicImage/DynamicImage';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string>(images[0]);
  const [direction, setDirection] = useState(0);

  const handleImageChange = (newImage: string) => {
    const newIndex = images.indexOf(newImage);
    const currentIndex = images.indexOf(mainImage);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setMainImage(newImage);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-x-auto py-2 md:py-0">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-16 h-16 md:w-20 md:h-20 cursor-pointer rounded-lg border-2 transition-all ${
              mainImage === image 
                ? 'border-red-500 scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleImageChange(image)}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded"
            />
            <div className={`absolute inset-0 bg-black bg-opacity-0 transition-opacity ${
              mainImage === image ? 'opacity-0' : 'group-hover:opacity-20'
            }`}></div>
          </motion.div>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative h-96 md:h-[500px] bg-gray-50 rounded-xl overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={mainImage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <DynamicImage imageUrl={mainImage} altText="Main Product Image" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageGallery;