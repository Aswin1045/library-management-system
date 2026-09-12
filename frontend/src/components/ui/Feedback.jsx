import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Spinner = () => (
  <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
    />
  </div>
);

export const ErrorMessage = ({ message, onRetry, autoDismiss = false }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          style={{ padding: 'var(--space-md)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}
        >
          <p><strong>Error:</strong> {message}</p>
          {onRetry && (
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline" 
              style={{ marginTop: 'var(--space-sm)' }} 
              onClick={onRetry}
            >
              Retry
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'var(--accent-light)' : 'var(--danger-light)';
  const color = type === 'success' ? 'var(--accent)' : 'var(--danger)';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        backgroundColor: bg,
        color: color,
        borderRadius: '24px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
    >
      {message}
    </motion.div>
  );
}

export const EmptyState = ({ title, description }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    style={{ textAlign: 'center', padding: 'var(--space-xxl)', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-lg)' }}
  >
    <h3 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)' }}>{description}</p>
  </motion.div>
);
