import React from 'react';
import { BoardBackground } from './components/investigation/BoardBackground';
import { CabinetDossier } from './components/archive/CabinetDossier';

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
      <div id="blink-overlay" className="flex items-center justify-center flex-col overflow-hidden">
        <img id="intro-logo" src="/ACM_logo.png" alt="ACM Logo" className="w-[400px] max-w-[80vw] object-contain will-change-transform" />
      </div>
      <button
        id="skip-intro-btn"
        onClick={() => { if (window.skipIntroTour) window.skipIntroTour(); }}
        className="fixed top-6 right-6 z-[95] bg-black/60 hover:bg-black/90 text-white/90 hover:text-white font-mono text-xs tracking-widest px-4 py-2 rounded-full border border-white/20 transition-all hover:scale-105 shadow-lg flex items-center gap-1.5"
      >
        <span>SKIP TOUR</span>
        <span>&#10148;</span>
      </button>
      <div id="controls-help" className="hidden-controls">
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

      <div id="joystick-zone" className="hidden-controls">
        <div id="joystick-stick"></div>
      </div>
      <div id="cutscene-table" className="cutscene-screen" title="Click to close table blueprint">
        <div id="newspaper-container">
          <img id="newspaper-folded" src="/newspaper.png" alt="News Article" />
          <img id="newspaper-full" src="/Full_newspaper.jpeg" alt="Full News Article" />
        </div>
      </div>
      <div id="cutscene-board" className="cutscene-screen">
        <BoardBackground onClose={() => {
          if (window.closeBoardCutscene) window.closeBoardCutscene();
          else {
            const el = document.getElementById('cutscene-board');
            if (el) el.classList.remove('active');
          }
        }} />
      </div>
      <div id="cutscene-window" className="cutscene-screen" title="Click to step back from window">
        <video
          id="windowVideoRoom"
          src="/videos/12254166_3840_2160_60fps.mp4"
          preload="auto"
          autoPlay
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
        <img
          src="/ACM_logo.png"
          alt="ACM Logo"
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            width: '240px',
            height: '240px',
            zIndex: 10,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
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
      <div id="cutscene-cabinet" className="cutscene-screen">
        <CabinetDossier onClose={() => {
          if (window.closeCabinetCutscene) window.closeCabinetCutscene();
          else {
            const el = document.getElementById('cutscene-cabinet');
            if (el) el.classList.remove('active');
          }
        }} />
      </div>

      <video
        id="windowVideo"
        src="/videos/8623-212638552.mp4"
        preload="auto"
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ position: 'fixed', top: 0, left: 0, width: '1px', height: '1px', opacity: 0.001, pointerEvents: 'none', zIndex: -100 }}
      />

    </>
  );
}
