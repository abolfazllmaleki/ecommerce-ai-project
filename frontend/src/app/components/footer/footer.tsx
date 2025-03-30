'use client'
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* MyStore Section */}
        <div className="footer-section logo-section">
          <h2 className="footer-logo">MyStore</h2>
          <p className="footer-description">
            Your one-stop shop for the best products. We bring quality and value right to your doorstep.
          </p>
        </div>

        {/* Support Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Support</h3>
          <ul className="footer-links">
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/returns">Returns</a></li>
            <li><a href="/shipping">Shipping Info</a></li>
          </ul>
        </div>

        {/* Account Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Account</h3>
          <ul className="footer-links">
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
            <li><a href="/orders">Order History</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Download App Section */}
        <div className="footer-section">
          <h3 className="footer-heading">Download Our App</h3>
          <p className="footer-description">
            Get our app for the best shopping experience.
          </p>
          <div className="app-buttons">
            <a href="#" className="app-button">Google Play</a>
            <a href="#" className="app-button">App Store</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 MyStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


