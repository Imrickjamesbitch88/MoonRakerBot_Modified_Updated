import React from 'react';
import Cookies from 'js-cookie';

interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  return (
    <div className="cookie-consent">
      <p>We use cookies to improve your experience. By using our site, you consent to cookies.</p>
      <button onClick={onAccept}>Accept</button>
    </div>
  );
};

export default CookieConsent;
