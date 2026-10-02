import React from 'react';

export default function UI() {
  return (
    <>


<div id="loading-container">
  <div id="loading-badge">ACM Council Experience</div>
  <h1 id="loading-title">Secret Heist Cellar</h1>
  <div id="loading-bar-track">
    <div id="loading-bar-fill"></div>
  </div>
  <div id="loading-status">Loading Assets...</div>
  <div id="loading" style={{ display: 'none' }}></div>
</div>
<div id="blink-overlay"></div>
<div id="controls-help">
  <div className="control-row">
    <div className="wasd-cluster">
      <div className="key-row"><span className="key">W</span></div>
      <div className="key-row"><span className="key">A</span><span className="key">S</span><span className="key">D</span></div>
    </div>
    <span>to Walk</span>
  </div>
  <p><strong>Drag</strong> to Look</p>
  <p><strong>Walk up</strong> to Investigate</p>
</div>

<div id="joystick-zone">
  <div id="joystick-stick"></div>
</div>
<div id="cutscene-table" className="cutscene-screen" title="Click to close table blueprint">
    <div id="newspaper-container">
      <img id="newspaper-folded" src="/newspaper.png" alt="News Article" />
      <img id="newspaper-full" src="/Full_newspaper.jpeg" alt="Full News Article" />
    </div>
</div>
<div id="cutscene-board" className="cutscene-screen" title="Click to close board evidence"></div>
<div id="cutscene-window" className="cutscene-screen" title="Click to step back from window">
  <video 
    id="cutscene-window-player"
    src="/videos/12254166_3840_2160_60fps.mp4"
    preload="auto"
    loop 
    muted 
    playsInline 
    crossOrigin="anonymous"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
  <div style={{
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.65)',
    backdropFilter: 'blur(8px)',
    padding: '10px 24px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    letterSpacing: '1px',
    pointerEvents: 'none'
  }}>
    Click anywhere to step back
  </div>
</div>
<div id="cutscene-cabinet" className="cutscene-screen" title="Click to step back from cabinet">
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'monospace', fontSize: '24px', textAlign: 'center', letterSpacing: '2px'}}>
        <span style={{fontSize: '14px', opacity: '0.5'}}></span>
    </div>
</div>

<video 
  id="windowVideo" 
  src="/videos/8623-212638552.mp4" 
  preload="auto" 
  loop 
  muted 
  playsInline 
  crossOrigin="anonymous" 
  style={{position: 'fixed', top: 0, left: 0, width: '1px', height: '1px', opacity: 0.001, pointerEvents: 'none', zIndex: -100}}
/>
<video 
  id="windowVideoRoom" 
  src="/videos/12254166_3840_2160_60fps.mp4" 
  preload="auto" 
  loop 
  muted 
  playsInline 
  crossOrigin="anonymous" 
  style={{position: 'fixed', top: 0, left: 0, width: '1px', height: '1px', opacity: 0.001, pointerEvents: 'none', zIndex: -100}}
/>

    </>
  );
}
