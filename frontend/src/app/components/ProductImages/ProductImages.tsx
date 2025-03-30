import React from 'react';
import './ProductImages.css';

const ProductImages = () => {
  const images = [
    'image1.jpg', // replace with actual image URLs
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
  ];

  return (
    <div className="product-images">
      <div className="main-image">
        <img src={images[0]} alt="Main Product" />
      </div>
      <div className="thumbnail-images">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Thumbnail ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
