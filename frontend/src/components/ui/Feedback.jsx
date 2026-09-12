import React from 'react';

export const Spinner = () => (
  <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
    <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
  </div>
);

export const ErrorMessage = ({ message, onRetry }) => (
  <div style={{ padding: 'var(--space-md)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
    <p><strong>Error:</strong> {message}</p>
    {onRetry && <button className="btn btn-outline" style={{ marginTop: 'var(--space-sm)' }} onClick={onRetry}>Retry</button>}
  </div>
);

export const EmptyState = ({ title, description }) => (
  <div style={{ textAlign: 'center', padding: 'var(--space-xxl)', backgroundColor: 'var(--surface-alt)', borderRadius: 'var(--radius-lg)' }}>
    <h3 style={{ color: 'var(--text-main)', marginBottom: 'var(--space-sm)' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)' }}>{description}</p>
  </div>
);
