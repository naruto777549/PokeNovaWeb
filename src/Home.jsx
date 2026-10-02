import React from 'react';

function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      
      <header style={{ paddingBottom: '20px', borderBottom: '1px solid #333' }}>
        <h1 style={{ color: '#f39c12', margin: '0' }}>PokeNova Dashboard</h1>
        <p style={{ color: '#aaa', marginTop: '5px' }}>Live Trainer Data & Inventory</p>
      </header>

      <main style={{ marginTop: '30px' }}>
        <div style={{ 
          backgroundColor: '#2a2a2a', 
          padding: '20px', 
          borderRadius: '10px', 
          width: '300px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
        }}>
          <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '10px' }}>Trainer Stats</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
            <span>Heavyballs:</span>
            <span style={{ fontWeight: 'bold', color: '#f39c12' }}>--</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
            <span>Moonballs:</span>
            <span style={{ fontWeight: 'bold', color: '#f39c12' }}>--</span>
          </div>
          
        </div>
      </main>

    </div>
  );
}

export default Home;
