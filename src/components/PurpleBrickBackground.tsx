import React from 'react';

export function PurpleBrickBackground() {
  // Using CSS background color that resembles the purple brick wall
  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%',
        zIndex: -1,
        backgroundColor: '#1a0933', // Dark purple base
        backgroundImage: `
          linear-gradient(to right, rgba(50, 0, 80, 0.8) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(50, 0, 80, 0.8) 1px, transparent 1px),
          linear-gradient(135deg, rgba(90, 0, 120, 0.4) 25%, transparent 25%),
          linear-gradient(225deg, rgba(90, 0, 120, 0.4) 25%, transparent 25%),
          linear-gradient(315deg, rgba(90, 0, 120, 0.4) 25%, transparent 25%),
          linear-gradient(45deg, rgba(90, 0, 120, 0.4) 25%, transparent 25%)
        `,
        backgroundSize: '24px 24px, 24px 24px, 48px 48px, 48px 48px, 48px 48px, 48px 48px',
        backgroundPosition: '0 0, 0 0, 0 0, 0 0, 24px 24px, 24px 24px'
      }} 
    >
      {/* Add a purple glow effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxShadow: 'inset 0 0 150px 50px rgba(120, 0, 180, 0.3)',
          background: 'radial-gradient(circle at center, rgba(120, 0, 180, 0.2) 0%, rgba(20, 0, 30, 0.8) 100%)',
          zIndex: -1
        }}
      />
      
      {/* Add a dark gradient overlay to enhance text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
          zIndex: -1
        }}
      />
    </div>
  );
} 