# Implementation Plan & Resolution: Window Proximity Video Playback

This document details the root causes and architectural changes implemented to resolve the issue where approaching the window in the 3D cellar resulted in a pitch-black screen instead of playing the window video.

---

## 1. Problem Analysis & Root Causes

When exploring the 3D room, approaching the North wall window resulted in no video playback due to three interlocking issues:

1. **Empty Black Cutscene Screen (`#cutscene-window`)**:
   - In [src/UI.jsx](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/src/UI.jsx) and [src/index.css](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/src/index.css), `#cutscene-window` was configured as a fullscreen overlay with `background-color: black;` and an empty `<span></span>`.
   - Unlike the table cutscene (which had `#newspaper-overlay`) and the evidence board (which had `#cutscene-board` with `board.jpeg`), the window cutscene lacked any `<video>` element or media source.
   - When the user walked towards the window, the proximity check activated `#cutscene-window.active`, instantly blanketing the screen in solid black with no video playing.

2. **Premature Proximity Trigger (`z < -30`)**:
   - The 3D window mesh is positioned at `z = -42.5` on the North wall.
   - The proximity detection in [src/main_logic.js](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/src/main_logic.js) was checking `camera.position.z < -30`.
   - This triggered the black cutscene abruptly while the player was still over 12 units away from the window sill (in the walking path between the table and the window), hijacking the camera before the player could even reach the window.

3. **WebGL Texture Buffering (`preload="metadata"`)**:
   - The 3D window plane (`sky2`) maps to `video2` (`12254166_3840_2160_60fps.mp4`).
   - With `preload="metadata"`, browsers did not buffer decoded video frames for Three.js until an explicit playback event, causing the 3D window mesh to show an empty texture before user interaction.

---

## 2. Changes Implemented

### A. Integrated Fullscreen Cutscene Video Player ([src/UI.jsx](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/src/UI.jsx))
Replaced the empty placeholder in `#cutscene-window` with an active, high-resolution video element and an atmospheric glassmorphic exit prompt:

```jsx
<div id="cutscene-window" className="cutscene-screen" title="Click to step back from window">
  <video 
    id="cutscene-window-player"
    src="/videos/12254166_3840_2160_60fps.mp4"
    loop 
    muted 
    playsInline 
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
```
- Restored `preload="auto"` on both `windowVideo` and `windowVideoRoom` so the browser buffers initial frames for Three.js without delay (safe now that the Service Worker bypasses video Range requests).

---

### B. Fullscreen Responsive Video Styles ([src/index.css](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/src/index.css) & [style.css](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/style.css))
Configured the cutscene container and video player to fill the screen while maintaining proper aspect ratio:

```css
#cutscene-window {
  background-color: black;
  overflow: hidden;
}

#cutscene-window-player {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  display: block;
}
```

---

### C. Proximity Calibration & Playback Synchronization ([src/main_logic.js](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/src/main_logic.js) & [main.js](file:///c:/Users/ayden/OneDrive/Desktop/3d%20room/3d-_room/main.js))
1. **Calibrated Proximity Threshold**:
   - Adjusted `z < -30` to `z < -34`.
   - Players can now naturally walk up to the wooden window sill and architectural frame before entering the investigation view.

2. **Playback Synchronization**:
   - When the window proximity triggers, `cutscene-window-player` starts playing immediately.
   - Synchronizes `cutsceneVid.currentTime = video2.currentTime` so the video transition matches the exact frame visible on the 3D wall.
   - Ensures the 3D window video (`video2`) is also playing:

```javascript
if (canTriggerCutscene) {
  const isNearWindow = camera.position.x > -25 && camera.position.x < -5 && 
                       camera.position.z < -34;
  if (isNearWindow) {
    cutsceneWindowTriggered = true;
    const cutsceneWindow = document.getElementById('cutscene-window');
    if (cutsceneWindow) cutsceneWindow.classList.add('active');
    const cutsceneVid = document.getElementById('cutscene-window-player');
    if (cutsceneVid) {
      if (video2 && video2.currentTime) {
        cutsceneVid.currentTime = video2.currentTime;
      }
      cutsceneVid.play().catch(() => {});
    }
    if (video2 && video2.paused) {
      video2.play().catch(() => {});
    }
  }
}
```

3. **Clean Teardown on Exit**:
   - When the user clicks anywhere on the cutscene to step back, `cutsceneVid.pause()` is called to conserve GPU resources, and the camera smoothly lerps back to standing height at `(-15, 0, -25)`.

---

## 3. Verification & Testing

### Verification Checklist:
1. **3D Scene Window Check**:
   - Look North towards Window 2 at `(-15, 5, -42.5)` — the video texture should play on the window plane with lighting and shadows.
2. **Proximity Trigger Check**:
   - Walk forward towards the window using `W`.
   - Observe that you can walk up to the window sill (`z = -34`) before the transition activates.
3. **Cutscene Video Check**:
   - When the cutscene triggers, the video immediately displays fullscreen in high clarity with the "Click anywhere to step back" prompt.
4. **Step-Back Transition Check**:
   - Click anywhere on the screen — the cutscene closes, the video pauses, and the camera smoothly returns to `(-15, 0, -25)`.
