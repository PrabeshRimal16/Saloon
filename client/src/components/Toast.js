import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ─── Toast CSS ────────────────────────────────────────────────────────────────
const TOAST_CSS = `
  .toast-container {
    position: fixed;
    top: 88px;
    right: 24px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    max-width: 380px;
    width: calc(100vw - 48px);
  }

  .toast {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 14px;
    background: white;
    box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
    pointer-events: all;
    position: relative;
    overflow: hidden;
    animation: toast-in 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
    border: 1px solid rgba(0,0,0,0.06);
  }

  .toast.toast-leaving {
    animation: toast-out 0.25s ease forwards;
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(110%) scale(0.94); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes toast-out {
    from { opacity: 1; transform: translateX(0) scale(1); max-height: 120px; margin-bottom: 0; }
    to   { opacity: 0; transform: translateX(110%) scale(0.94); max-height: 0; margin-bottom: -10px; }
  }

  /* Progress bar */
  .toast-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 3px;
    border-radius: 0 0 14px 14px;
    animation: toast-progress linear forwards;
    transform-origin: left;
  }
  @keyframes toast-progress {
    from { width: 100%; }
    to   { width: 0%; }
  }

  /* Icon bubble */
  .toast-icon-wrap {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .toast-icon {
    font-size: 18px;
    line-height: 1;
  }

  /* Content */
  .toast-content { flex: 1; min-width: 0; padding-top: 2px; }
  .toast-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    color: #1C1C1E; margin: 0 0 2px;
    line-height: 1.3;
  }
  .toast-message {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: #6B6B6B;
    margin: 0; line-height: 1.45;
  }

  /* Close */
  .toast-close {
    width: 24px; height: 24px; border-radius: 50%;
    border: none; background: #F5F5F5;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #999; flex-shrink: 0; padding: 0;
    transition: background 0.15s, color 0.15s;
    font-size: 14px; line-height: 1;
  }
  .toast-close:hover { background: #EBEBEB; color: #1C1C1E; }

  /* Variants */
  .toast-success .toast-icon-wrap { background: rgba(45,122,79,0.1); }
  .toast-success .toast-icon      { color: #2D7A4F; }
  .toast-success .toast-progress  { background: #2D7A4F; }

  .toast-error .toast-icon-wrap { background: rgba(192,57,43,0.1); }
  .toast-error .toast-icon      { color: #C0392B; }
  .toast-error .toast-progress  { background: #C0392B; }

  .toast-info .toast-icon-wrap { background: rgba(184,150,12,0.1); }
  .toast-info .toast-icon      { color: #B8960C; }
  .toast-info .toast-progress  { background: #B8960C; }
`;

// ─── Icons per variant ────────────────────────────────────────────────────────
const ICONS = {
  success: 'check_circle',
  error:   'error',
  info:    'info',
};

// ─── Single Toast ─────────────────────────────────────────────────────────────
function Toast({ id, type = 'info', title, message, duration = 4000, onRemove }) {
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onRemove(id), 260);
  }, [id, onRemove]);

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, duration);
    return () => clearTimeout(timerRef.current);
  }, [dismiss, duration]);

  return (
    <div className={`toast toast-${type}${leaving ? ' toast-leaving' : ''}`} role="alert" aria-live="polite">
      <div className="toast-icon-wrap">
        <span className="material-symbols-outlined toast-icon">{ICONS[type]}</span>
      </div>
      <div className="toast-content">
        {title   && <p className="toast-title">{title}</p>}
        {message && <p className="toast-message">{message}</p>}
      </div>
      <button className="toast-close" onClick={dismiss} aria-label="Dismiss notification">×</button>
      <div
        className="toast-progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  const toast = {
    success: (message, title = 'Success')  => add({ type: 'success', title, message }),
    error:   (message, title = 'Error')    => add({ type: 'error',   title, message }),
    info:    (message, title = 'Info')     => add({ type: 'info',    title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      <style>{TOAST_CSS}</style>
      {children}
      <div className="toast-container" aria-label="Notifications">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
