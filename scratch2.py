import re

with open('src/UI.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

target1 = """      <div id="blink-overlay"></div>"""
replacement1 = """      <div id="blink-overlay" className="flex items-center justify-center flex-col">
        <div id="scroll-prompt" className="text-white/70 font-mono text-xl tracking-[0.3em] flex flex-col items-center gap-4 opacity-100 transition-opacity duration-1000">
          <p>SCROLL TO WAKE</p>
          <div className="w-px h-16 bg-gradient-to-b from-white/70 to-transparent"></div>
        </div>
      </div>"""

if target1 in text:
    text = text.replace(target1, replacement1)
    with open('src/UI.jsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced in UI.jsx")
else:
    print("UI.jsx already has it or target not found")
