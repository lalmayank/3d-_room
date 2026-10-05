import React, { useEffect, useState, useRef } from 'react';
import { Pin, Tape, StickyNote, NewspaperBlock, DocumentFile } from './SharedElements';

const POINTS = [
  { x: 1800, y: 2000 }, // Nerf
  { x: 1700, y: 3100 }, // AI/ML
  { x: 2600, y: 3200 }, // Semicode
  { x: 3450, y: 2100 }, // Shark Tank
  { x: 3000, y: 2570 }  // Center (India)
];

export const BoardBackground = ({ onClose }) => {
  const [progress, setProgress] = useState(0);
  const boardRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setProgress(p => {
        const newP = p + (e.deltaY * 0.0004);
        return Math.max(0, Math.min(1, newP));
      });
    };

    let isDragging = false;
    let dragStartY = 0;
    let dragStartX = 0;

    const handleMouseDown = (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('button')) return;
      isDragging = true;
      dragStartY = e.clientY;
      dragStartX = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const delta = (dragStartY - e.clientY) + (dragStartX - e.clientX);
      dragStartY = e.clientY;
      dragStartX = e.clientX;
      setProgress(p => {
        const newP = p + (delta * 0.0008);
        return Math.max(0, Math.min(1, newP));
      });
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      setProgress(p => {
        const newP = p + (deltaY * 0.001);
        return Math.max(0, Math.min(1, newP));
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Calculate Camera Position
  const totalSegments = POINTS.length - 1;
  const rawIndex = progress * totalSegments;
  const index = Math.floor(rawIndex);
  const nextIndex = Math.min(index + 1, totalSegments);
  const segmentProgress = rawIndex - index;

  const currentX = POINTS[index].x + (POINTS[nextIndex].x - POINTS[index].x) * segmentProgress;
  const currentY = POINTS[index].y + (POINTS[nextIndex].y - POINTS[index].y) * segmentProgress;

  // Center the camera on the screen
  const translateX = typeof window !== 'undefined' ? (window.innerWidth / 2) - currentX : 0;
  const translateY = typeof window !== 'undefined' ? (window.innerHeight / 2) - currentY : 0;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 bg-[#c8ab83] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ fontFamily: "sans-serif" }}
      onClick={(e) => e.stopPropagation()}
    >

      {/* Scroll / Drag Hint */}
      <div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 text-white font-mono text-sm md:text-base tracking-widest z-[1000] bg-black/75 px-6 py-3 rounded-full shadow-2xl transition-opacity duration-500 pointer-events-none border border-white/20"
        style={{ opacity: progress > 0.02 ? 0 : 1 }}
      >
        &#8597; SCROLL TO REVEAL EVENTS
      </div>

      {/* Progress Pill Indicator */}
      <div className="fixed top-8 left-10 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15 text-white/80 font-mono text-xs tracking-widest z-[1000] pointer-events-none flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
        CASE EVIDENCE: {Math.round(progress * 100)}%
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-8 right-10 text-white bg-red-700/90 hover:bg-red-600 px-6 py-2.5 rounded-full font-bold tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.5)] z-[1000] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 text-sm border border-red-400/40"
      >
        <span>&#10005;</span> STEP BACK
      </button>

      {/* The Moving Cork Board */}
      <div
        ref={boardRef}
        className="absolute w-[5000px] h-[5000px] bg-[#c8ab83] origin-top-left"
        style={{
          transform: `translate(${translateX}px, ${translateY}px)`,
          transition: 'transform 0.12s cubic-bezier(0.1, 0.9, 0.2, 1)'
        }}
      >
        {/* Map Background Layer */}
        <div
          className="absolute inset-0 opacity-65 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 35%, rgba(60, 30, 0, 0.85) 100%),
              repeating-linear-gradient(0deg, rgba(80, 40, 0, 0.15) 0px, rgba(80, 40, 0, 0.15) 2px, transparent 2px, transparent 80px),
              repeating-linear-gradient(90deg, rgba(80, 40, 0, 0.15) 0px, rgba(80, 40, 0, 0.15) 2px, transparent 2px, transparent 80px),
              url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')
            `,
            backgroundSize: '100% 100%, 80px 80px, 80px 80px, 2600px auto',
            backgroundPosition: 'center, center, center, 1200px 2000px',
            backgroundRepeat: 'no-repeat, repeat, repeat, no-repeat',
            backgroundBlendMode: 'normal, normal, normal, multiply'
          }}
        ></div>

        {/* Red Twine Strings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]">
          <line className="thread" x1="2575" y1="2600" x2="1800" y2="2000" style={{ stroke: '#d32f2f', strokeWidth: 5, strokeLinecap: 'round', filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.6))', strokeDasharray: 2000, strokeDashoffset: progress >= 0 ? 0 : 2000, transition: 'stroke-dashoffset 1.5s ease' }} />
          <line className="thread" x1="1800" y1="2000" x2="1700" y2="3100" style={{ stroke: '#d32f2f', strokeWidth: 5, strokeLinecap: 'round', filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.6))', strokeDasharray: 2000, strokeDashoffset: progress > 0.05 ? 0 : 2000, transition: 'stroke-dashoffset 1.5s ease' }} />
          <line className="thread" x1="1700" y1="3100" x2="2600" y2="3200" style={{ stroke: '#d32f2f', strokeWidth: 5, strokeLinecap: 'round', filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.6))', strokeDasharray: 2000, strokeDashoffset: progress > 0.30 ? 0 : 2000, transition: 'stroke-dashoffset 1.5s ease' }} />
          <line className="thread" x1="2600" y1="3200" x2="3450" y2="2100" style={{ stroke: '#d32f2f', strokeWidth: 5, strokeLinecap: 'round', filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.6))', strokeDasharray: 2000, strokeDashoffset: progress > 0.55 ? 0 : 2000, transition: 'stroke-dashoffset 1.5s ease' }} />
          <line className="thread" x1="3450" y1="2100" x2="2575" y2="2600" style={{ stroke: '#d32f2f', strokeWidth: 5, strokeLinecap: 'round', filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.6))', strokeDasharray: 2000, strokeDashoffset: progress > 0.80 ? 0 : 2000, transition: 'stroke-dashoffset 1.5s ease' }} />
        </svg>
        
        {/* CLUSTER CENTER: EVENTS (Central Node) */}
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-700 ${progress >= 0.85 ? 'opacity-100' : 'opacity-20 pointer-events-none'}`} style={{ left: 2575, top: 2600 }}>
          <Pin style={{ top: -10 }} />
          <div
            className="w-[320px] h-[120px] bg-[#e8dbbe] rounded-sm flex justify-center items-center"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #f5ecd6 0%, #e8dbbe 80%, #d1c1a5 100%)',
              boxShadow: '4px 8px 15px rgba(0,0,0,0.4), inset 0 0 20px rgba(139,115,85,0.2)',
              clipPath: 'polygon(1% 2%, 98% 0%, 99% 97%, 3% 99%, 0% 50%)'
            }}
          >
            <h1 className="text-[3.5em] text-[#1a365d] m-0 tracking-[2px] uppercase drop-shadow-[1px_1px_2px_rgba(255,255,255,0.8)]" style={{ fontFamily: "'Oswald', sans-serif" }}>
              EVENTS
            </h1>
          </div>
        </div>

        {/* CLUSTER 1: Nerf Battle */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10 opacity-100" style={{ left: 1800, top: 2000 }}>
          <Tape style={{ top: -10, right: 20, transform: 'rotate(10deg)' }} />
          <NewspaperBlock
            header="THE DAILY CHRONICLE"
            title="Mystery Solved!"
            content="After weeks of speculation, authorities have finally cracked the case. The missing documents were found hidden in plain sight. Local residents express relief as the primary suspect is taken into custody. Further details will be released in tomorrow's edition."
            style={{ position: 'absolute', left: -200, top: -50, transform: 'rotate(-8deg)', zIndex: 5 }}
          />

          <img
            src="/evidence_board/evidence_1.jpeg"
            alt="Evidence 1"
            className="w-[280px] object-cover shadow-[3px_6px_15px_rgba(0,0,0,0.5)] bg-white p-2 pb-6 relative z-10"
            style={{ transform: 'rotate(-3deg)' }}
          />
          <Pin style={{ left: 20, top: 10, position: 'absolute', zIndex: 20 }} />

          <StickyNote style={{ position: 'absolute', left: 240, top: 180, transform: 'rotate(7deg)', zIndex: 12 }}>
            Team size?
          </StickyNote>
        </div>

        {/* CLUSTER 2: AI/ML Workshop */}
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-500 ${progress >= 0.15 ? 'opacity-100' : 'opacity-20'}`} style={{ left: 1700, top: 3100 }}>
          <Pin style={{ top: 0, left: 0, position: 'absolute', zIndex: 20 }} />
          <NewspaperBlock
            header="EVENING POST"
            title="Cipher Decoded!"
            content="Another breakthrough in the ongoing saga. Investigators pieced together the final clues yesterday evening inside the underground server room."
            style={{ position: 'absolute', left: -180, top: 100, width: 180, transform: 'rotate(-5deg)', zIndex: 5 }}
          />

          <img
            src="/evidence_board/evidence_2.jpeg"
            alt="Evidence 2"
            className="w-[280px] object-cover shadow-[3px_6px_15px_rgba(0,0,0,0.5)] bg-white p-2 pb-6 relative z-10"
            style={{ transform: 'rotate(2deg)' }}
          />
        </div>

        {/* CLUSTER 3: Semicode */}
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-500 ${progress >= 0.35 ? 'opacity-100' : 'opacity-20'}`} style={{ left: 2600, top: 3200 }}>
          <Pin style={{ left: '50%', top: 5, position: 'absolute', zIndex: 20 }} />

          <img
            src="/evidence_board/evidence_3.jpeg"
            alt="Evidence 3"
            className="w-[280px] object-cover shadow-[3px_6px_15px_rgba(0,0,0,0.5)] bg-white p-2 pb-6 relative z-10"
            style={{ transform: 'rotate(-2deg)' }}
          />

          <StickyNote style={{ position: 'absolute', left: 240, top: 100, transform: 'rotate(-4deg)', zIndex: 12 }}>
            <Pin style={{ bottom: 10, right: 10, top: 'auto', left: 'auto', position: 'absolute' }} />
            Deadline!
          </StickyNote>
        </div>

        {/* CLUSTER 4: Shark Tank */}
        <div className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-opacity duration-500 ${progress >= 0.60 ? 'opacity-100' : 'opacity-20'}`} style={{ left: 3450, top: 2100 }}>
          <NewspaperBlock
            header="THE TRIBUNE"
            title="The Vault Heist"
            content="The conclusion to the events that shocked the council. Full blueprints and suspect transcripts retrieved."
            style={{ position: 'absolute', right: -150, top: -180, width: 200, transform: 'rotate(12deg)', zIndex: 5 }}
          />

          <Pin style={{ left: '30%', top: 5, position: 'absolute', zIndex: 20 }} />
          <img
            src="/evidence_board/evidence_4.jpeg"
            alt="Evidence 4"
            className="w-[280px] object-cover shadow-[3px_6px_15px_rgba(0,0,0,0.5)] bg-white p-2 pb-6 relative z-10"
            style={{ transform: 'rotate(4deg)' }}
          />

          <StickyNote style={{ position: 'absolute', right: -100, top: 120, transform: 'rotate(-6deg)', zIndex: 9 }}>
            Final Pitch!
          </StickyNote>

          <div style={{ position: 'absolute', top: 320, left: 0, transform: 'rotate(-3deg)', zIndex: 8 }}>
            <DocumentFile
              title="VAULT BLUEPRINTS"
              content="Reports indicate subterranean passages beneath the old council library..."
              style={{ transform: 'rotate(-5deg)', marginBottom: -20 }}
            />
            <Tape style={{ top: -10, left: 30 }} />
            <DocumentFile
              title="COUNCIL MINUTES"
              content="Deliberation on annual hackathon logistics and security protocols..."
              style={{ transform: 'rotate(8deg)', marginLeft: 50, marginBottom: -10 }}
            />
            <DocumentFile
              title="FORGOTTEN FILES"
              content="Case #404: The missing master key to the archive safe."
              style={{ transform: 'rotate(2deg)', background: '#d4c4a1', position: 'relative' }}
            />
            <Pin style={{ left: 10, top: 10 }} />
          </div>
        </div>

      </div>
    </div>
  );
};
