import React from 'react';

export const CabinetDossier = ({ onClose }) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full cursor-pointer"
      onClick={onClose}
      title="Click to step back from cabinet"
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '24px',
        textAlign: 'center',
        letterSpacing: '2px'
      }}>
        <span style={{ fontSize: '14px', opacity: '0.5' }}></span>
      </div>
    </div>
  );
};
