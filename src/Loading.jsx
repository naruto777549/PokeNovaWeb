import React from 'react';

function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: '#fff' }}>
      
      <h1 style={{ color: '#f39c12', marginBottom: '20px', letterSpacing: '2px' }}>
        PokeNova Web
      </h1>
      
      {/* Animated Spinner */}
      <div style={{ 
        border: '4px solid rgba(255, 255, 255, 0.1)', 
        borderTop: '4px solid #f39c12', 
        borderRadius: '50%', 
        width: '50px', 
        height: '50px', 
        animation: 'spin 1s linear infinite' 
      }}></div>

      <style>
        {`
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        `}
      </style>
      
      <p style={{ marginTop: '15px', color: '#888' }}>Syncing with Database...</p>
    </div>
  );
}

export default Loading;
