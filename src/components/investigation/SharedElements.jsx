import React from 'react';

export const Pin = ({ style = {}, isRed = true }) => (
  <div 
    className="absolute w-5 h-5 rounded-full z-30"
    style={{
      transform: 'translate(-50%, -50%)',
      boxShadow: 'inset -3px -3px 5px rgba(0,0,0,0.5), 3px 6px 10px rgba(0,0,0,0.6)',
      background: isRed ? 'radial-gradient(circle at 30% 30%, #ff5252 0%, #d32f2f 40%, #7f0000 100%)' : '#444',
      ...style
    }}
  >
    <div className="absolute top-[12px] left-[9px] w-[3px] h-[15px] bg-black/60 -rotate-[25deg] -z-10 blur-[1px]"></div>
  </div>
);

export const Tape = ({ style = {} }) => (
  <div 
    className="absolute bg-[#e6dcbe]/85 w-[70px] h-[22px] shadow-[0_1px_3px_rgba(0,0,0,0.2)] z-20 pointer-events-none"
    style={{ clipPath: 'polygon(5% 0%, 95% 2%, 98% 98%, 2% 95%)', ...style }}
  ></div>
);

export const StickyNote = ({ children, style = {} }) => (
  <div 
    className="absolute bg-[#e9db6b] shadow-[-2px_4px_8px_rgba(0,0,0,0.3)] p-4 flex justify-center items-center text-center text-[#222]"
    style={{ width: 140, height: 140, fontFamily: "'Caveat', cursive, sans-serif", fontSize: '1.6em', ...style }}
  >
    {children}
  </div>
);

export const NewspaperBlock = ({ header, title, content, style = {} }) => (
  <div 
    className="absolute bg-[#dcd3c0] p-4 text-[#222] shadow-[3px_6px_15px_rgba(0,0,0,0.4)] w-[220px]"
    style={{ fontFamily: "'Playfair Display', serif", ...style }}
  >
    <div className="text-center mb-1 pb-[2px] border-b border-[#999] text-[0.6em]" style={{ fontFamily: "'Special Elite', monospace" }}>{header}</div>
    <h2 className="text-[1.2em] font-black uppercase leading-[1.1] mb-2 pb-1 border-b-2 border-[#333] text-center">{title}</h2>
    <p className="text-[0.75em] text-justify m-0 leading-[1.2] columns-2 gap-2.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      {content}
    </p>
  </div>
);

export const DocumentFile = ({ title, content, style = {} }) => (
  <div 
    className="bg-[#dfd3bb] p-4 w-[150px] shadow-[2px_4px_10px_rgba(0,0,0,0.3)] text-[#333]"
    style={{ fontFamily: "'Cormorant Garamond', serif", ...style }}
  >
    <h3 className="m-0 mb-1 text-[1.1em] uppercase text-center border-b border-dashed border-[#777]">{title}</h3>
    <p className="text-[0.8em] italic m-0">{content}</p>
  </div>
);
