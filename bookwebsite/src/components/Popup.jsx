import React from 'react';
import '../assets/styles/Popup.css';

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Popup;