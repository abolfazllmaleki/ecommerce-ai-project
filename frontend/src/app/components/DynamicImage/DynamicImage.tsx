'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

const DynamicImage = ({ imageUrl, altText }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full relative"
    >
      <Image
        src={imageUrl}
        alt={altText}
        fill
        style={{ objectFit: 'contain' }}
        className="rounded-lg"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent via-transparent pointer-events-none"></div>
    </motion.div>
  );
};

export default DynamicImage;