
'use client'
import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiHeart } from 'react-icons/fi';
import { FaGooglePlay, FaAppStore } from 'react-icons/fa';
import { useEffect } from 'react';
import './footer.css';

const Footer = () => {

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 className="footer-logo">MyStore</h2>
            <p className="footer-description">
              Your one-stop shop for the best products. We bring quality and value right to your doorstep.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
            </div>
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

          {/* Newsletter Section */}
          <div className="footer-section newsletter">
            <h3 className="footer-heading">Stay Updated</h3>
            <p className="footer-description">Subscribe to our newsletter for updates</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* App Download Section */}
        <div className="app-section">
          <div className="app-content">
            <div className="app-text">
              <h3>Download Our App</h3>
              <p>Get our app for the best shopping experience</p>
            </div>
            <div className="app-buttons">
              <a href="#" className="app-button">
                <FaGooglePlay className="app-icon" />
                <div>
                  <span>GET IT ON</span>
                  <strong>Google Play</strong>
                </div>
              </a>
              <a href="#" className="app-button">
                <FaAppStore className="app-icon" />
                <div>
                  <span>DOWNLOAD ON THE</span>
                  <strong>App Store</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 MyStore. All rights reserved.</p>
        <div className="footer-legal">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
        <div className="made-with">
          <p>Made with <FiHeart className="heart-icon" /> by abolfazl</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
