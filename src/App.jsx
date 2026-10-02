import React, { useState, useEffect } from 'react';
import Home from './Home';
import Loading from './Loading';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Fake loading delay (Baad me isko API fetch hone tak rok sakte ho)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 seconds loading
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? <Loading /> : <Home />}
    </div>
  );
}

export default App;
