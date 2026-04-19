import React from 'react';

interface Props {
  message?: string;
}

const LoadingSpinner: React.FC<Props> = ({ message = 'Loading...' }) => (
  <div className="spinner-wrap" style={{ flexDirection: 'column', gap: '1rem' }}>
    <div className="spinner" />
    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{message}</span>
  </div>
);

export default LoadingSpinner;
