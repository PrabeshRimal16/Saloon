import React, { useEffect } from 'react';
import './ConfirmModal.css';

function ConfirmModal({ isOpen, title = 'Are you sure?', message = '', confirmText = 'Confirm', confirmColor = '#C0392B', onConfirm = () => {}, onCancel = () => {} }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="cm-card" role="dialog" aria-modal="true">
        <div className="cm-topbar" />
        <div className="cm-icon">⚠️</div>
        <h3 className="cm-title">{title}</h3>
        <p className="cm-message">{message}</p>

        <div className="cm-actions">
          <button className="cm-btn cm-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="cm-btn cm-confirm"
            onClick={onConfirm}
            style={{ background: confirmColor }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfirmModal);
