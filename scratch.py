import re

with open('src/main_logic.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update window.skipIntroTour
target1 = """    window.skipIntroTour = () => {
      if (!isIntroPlaying) return;
      isIntroPlaying = false;
      controls.enabled = true;
      camera.position.set(-15, 0, -25);"""

replacement1 = """    window.skipIntroTour = () => {
      if (!isIntroPlaying) return;
      isIntroPlaying = false;
      controls.enabled = true;
      if (typeof lenis !== 'undefined') lenis.destroy();
      const p = document.getElementById('scroll-proxy');
      if (p) p.remove();
      camera.position.set(-15, 0, -25);"""

text = text.replace(target1, replacement1)

# 2. Add progress check at end of timeline
target2 = """            controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
            if (blink) {
              blink.style.display = 'none';
              blink.style.opacity = '0';
            }
            if (!window.windowCutsceneShown) {"""

replacement2 = """            controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
            if (blink) {
              blink.style.display = 'none';
              blink.style.opacity = '0';
            }
            
            if (typeof progress !== 'undefined' && progress >= 0.999) {
              window.skipIntroTour();
              return;
            }
            
            if (!window.windowCutsceneShown) {"""

text = text.replace(target2, replacement2)

with open('src/main_logic.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done replacements")
