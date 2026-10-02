import React from 'react';

export default function UI() {
  return (
    <>


<div id="loading">Loading 3D Models...</div>
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
    <img id="newspaper-overlay" src="/newspaper.png" alt="News Article" />
</div>
<div id="cutscene-board" className="cutscene-screen" title="Click to close board evidence"></div>
<div id="cutscene-window" className="cutscene-screen" title="Click to step back from window">
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'monospace', fontSize: '24px', textAlign: 'center', letterSpacing: '2px'}}>
        <span style={{fontSize: '14px', opacity: '0.5'}}></span>
    </div>
</div>
<div id="cutscene-cabinet" className="cutscene-screen" title="Click to step back from cabinet">
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'monospace', fontSize: '24px', textAlign: 'center', letterSpacing: '2px'}}>
        <span style={{fontSize: '14px', opacity: '0.5'}}></span>
    </div>
</div>

<video id="windowVideo" preload="auto" loop muted autoPlay crossOrigin="anonymous" playsInline style={{position: 'absolute', width: '0', height: '0', visibility: 'hidden'}}>
  <source src="/8623-212638552.mp4" type="video/mp4" />
</video>
<video id="windowVideoRoom" preload="auto" loop muted autoPlay crossOrigin="anonymous" playsInline style={{position: 'absolute', width: '0', height: '0', visibility: 'hidden'}}>
  <source src="/12254166_3840_2160_60fps.mp4" type="video/mp4" />
</video>

    </>
  );
}
