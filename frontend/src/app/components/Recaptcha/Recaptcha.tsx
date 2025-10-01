// components/ReCaptcha.tsx
"use client";
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
}

const ReCaptcha: React.FC<ReCaptchaProps> = ({ onVerify }) => {
  // For development, use test keys. Replace with your actual keys in production
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Google's test key

  return (
    <div className="my-4">
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onVerify}
      />
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
          <strong>Test reCAPTCHA active:</strong> For testing, you can use any value.
        </div>
      )}
    </div>
  );
};

export default ReCaptcha;