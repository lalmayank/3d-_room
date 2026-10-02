import React, { useEffect, useRef } from 'react';
import UI from './UI';
import { initThreeJS } from './main_logic';

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    let cleanup = null;
    
    // Slight delay to ensure DOM is fully painted since we're using vanilla getElementById heavily
    const timer = setTimeout(() => {
      if (mountRef.current) {
         cleanup = initThreeJS(mountRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 z-0"></div>
      <UI />
    </>
  );
}

export default App;
