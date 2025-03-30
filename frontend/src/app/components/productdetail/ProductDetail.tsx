import React from 'react';
import '../productdetail/ProductDetail.css';

const ProductDetails = () => {
  return (
    <div className="product-details">
      <h1>Havic HV G-92 Gamepad</h1>
      <p className="price">$192.00</p>
      <p className="availability">In Stock</p>
      <p className="description">
        PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble-free install & mess-free removal. Pressure sensitive.
      </p>
      <div className="options">
        <label>Colours:</label>
        <div className="colors">
          <button className="color red"></button>
          <button className="color black"></button>
        </div>
        <label>Size:</label>
        <div className="sizes">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <button key={size} className="size-btn">{size}</button>
          ))}
        </div>
      </div>
      <div className="quantity">
        <button>-</button>
        <input type="number" value="2" readOnly />
        <button>+</button>
      </div>
      <button className="buy-now">Buy Now</button>
      <div className="delivery">
        <p>🚚 Free Delivery - Enter your postal code for delivery availability</p>
        <p>🔄 Return Delivery - Free 30 Days Delivery Returns. <a href="#">Details</a></p>
      </div>
    </div>
  );
};

export default ProductDetails;
