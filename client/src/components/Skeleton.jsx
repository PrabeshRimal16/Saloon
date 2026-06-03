import React from 'react';

const Skeleton = () => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh'}}>
      <div style={{width: 280, height: 16, background: '#e6e6e6', borderRadius: 8, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)'}} />
    </div>
  );
};

export default React.memo(Skeleton);
