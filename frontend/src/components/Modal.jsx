import React, { useEffect } from 'react';
import '../styles/Modal.css';

const Modal = ({ isOpen, onClose, children, title }) => {
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // <div className="modal-backdrop" onClick={handleBackdropClick}>
    //   <div className="modal-container">
    //     <div className="modal-header">
    //       <h3 className="modal-title">{title}</h3>
    //       <button className="modal-close-btn" onClick={onClose}>
    //         <i className="fas fa-times"></i>
    //       </button>
    //     </div>
    //     <div className="modal-content">
    //       {children}
    //     </div>
    //   </div>
    // </div>
    <div
  className="modal fade show d-block"
  tabIndex="-1"
  role="dialog"
  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
>
  <div
    className={"modal-dialog modal-md"}
    role="document"
  >
    <div className="modal-content">
      <div className="modal-header">
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="modal-body p-0 m-0 textOverflow-ellipsis">
       {children}
      </div>
    </div>
  </div>
</div>
  );
};

export default Modal;
