# Local Optimization & Performance Verification Guide
> A step-by-step framework to benchmark, profile, and verify that the 3D Secret Heist Cellar website is fully optimized without needing to deploy it.

---

## 1. Run the Production Preview (Crucial First Step)
**Never benchmark performance using `npm run dev`**. The Vite dev server serves unbundled, unminified ES modules with React in development mode, active hot module replacement (HMR), and full source maps.

To test true real-world production performance locally:

```bash
# 1. Build the production bundle
npm run build

# 2. Start Vite's local production preview server
npm run preview
```
*Vite will start a local server (typically at `http://localhost:4173/`) serving the exact minified, tree-shaken static assets from `dist/`.*

---

## 2. Network Throttling & Bandwidth Stress Test
Simulate users loading the 3D room on real-world mobile 4G or slow broadband connections.

### How to Test:
1. Open Google Chrome (or Edge) in **Incognito Mode** (to disable extensions).
2. Open DevTools (`F12` or `Ctrl + Shift + I`) and switch to the **Network** tab.
3. Check the **Disable cache** box.
4. Set the **Throttling** dropdown from *No throttling* to **Fast 3G** or **Slow 4G**.
5. Filter by **All** or **Media / Fetch**.
6. Hard refresh the page (`Ctrl + F5`).

### What to Look For:
- [ ] **Waterfall Order**: The 8 `.glb` models should load while the loading screen displays real-time progress (`0% -> 100%`).
- [ ] **No Video Contention**: Window videos should **not** begin downloading until after the models have finished and the loading screen starts fading out.
- [ ] **No Range Request Loop**: Filter by `media` in the Network tab. You should see steady 206 streaming chunks, **never** an infinite waterfall of dozens of requests per second for the same video.
- [ ] **Total Transferred Size**: Check the bottom bar of DevTools for `transferred` vs `resources`. Ensure total initial payload is well within acceptable limits.

---

## 3. Real-Time Three.js WebGL & GPU Profiling
Check whether the WebGL scene is pushing too many draw calls or overloading the GPU.

### A. Quick Inspection via Console
Open the DevTools Console tab on the page and run:
```javascript
// Run this directly in the DevTools console:
const canvas = document.querySelector('canvas');
// Inspect Three.js internal render metrics (if renderer is exposed or attached to window):
console.table({
  "Draw Calls": window.renderer?.info.render.calls,
  "Triangles": window.renderer?.info.render.triangles,
  "Geometries in VRAM": window.renderer?.info.memory.geometries,
  "Textures in VRAM": window.renderer?.info.memory.textures
});
```

### B. Benchmark Targets for Smooth 60 FPS:
| Metric | Ideal Target | Acceptable | Warning / Needs Optimization |
| :--- | :--- | :--- | :--- |
| **Draw Calls per Frame** | < 80 | 80 – 150 | > 200 (Stutters on low-end GPUs) |
| **Rendered Triangles** | < 250,000 | 250k – 600,000 | > 1,000,000 (OOM on iOS Safari) |
| **Active Textures** | < 20 | 20 – 35 | > 50 (Exceeds mobile VRAM) |
| **Frame Rate** | 60 FPS | Steady 45–60 FPS | < 30 FPS drops during camera rotation |

---

## 4. CPU Throttling & Mobile Device Emulation
Test if low-to-mid tier mobile devices can render the 3D room without crashing or overheating.

### How to Test:
1. In DevTools, click the **Toggle device toolbar** button (`Ctrl + Shift + M`).
2. Select **iPhone 14 Pro** or **Pixel 7**.
3. Open the **Performance** tab (`Ctrl + Shift + E`).
4. Click the gear icon (Settings) in the top-right of the Performance panel.
5. Set **CPU** to **4x slowdown** or **6x slowdown**.
6. Click the record icon, walk around the room using the touch joystick for 10 seconds, trigger the table and board cutscenes, and click Stop.

### What to Verify:
- [ ] **FPS Graph**: The green FPS bar should stay relatively flat without massive red "jank" spikes.
- [ ] **Main Thread Activity**: Long tasks (bars with red corners) should be under 50ms during active exploration.
- [ ] **Tab Crash Check**: Verify that mobile Safari / WebKit does not trigger the *"A problem repeatedly occurred on this webpage"* crash overlay due to excessive memory usage.

---

## 5. Memory Leak & Tab Suspension Profiling
Ensure memory does not continuously climb as cutscenes trigger or as time passes.

### How to Test:
1. Open the DevTools **Memory** tab.
2. Select **Heap snapshot** -> Click **Take snapshot** (Snapshot 1 - Initial load).
3. Walk around the cellar for 1–2 minutes, enter and exit the table blueprint cutscene and the board evidence cutscene several times.
4. Take **Snapshot 2**.
5. Switch browser tabs for 30 seconds (verifying that background videos pause via `visibilitychange`), then switch back.
6. Take **Snapshot 3**.
7. Compare Snapshot 3 to Snapshot 1:
   - Check the **Comparison** view in DevTools.
   - Look for detached DOM trees, accumulating `WebGLTexture` objects, or continuously climbing `ArrayBuffer` sizes.

---

## 6. Run a Local Lighthouse Audit
Benchmark First Contentful Paint, Interaction to Next Paint, and Best Practices.

### How to Test:
1. Ensure the preview server (`npm run preview`) is running on `http://localhost:4173/`.
2. Open DevTools in an **Incognito window**.
3. Go to the **Lighthouse** tab.
4. Select:
   - **Mode:** Navigation
   - **Device:** Mobile (and then run a second pass on Desktop)
   - **Categories:** Performance, Best Practices, Accessibility, SEO
5. Click **Analyze page load**.

### Key Target Scores:
- **Performance:** ≥ 80+ (Note: WebGL apps typically score between 75–90 due to shader compilation on initial frame).
- **Largest Contentful Paint (LCP):** < 2.5s (The loading screen progress indicator should display immediately).
- **Cumulative Layout Shift (CLS):** < 0.1 (Canvas and HUD overlays should not jump or shift unexpectedly).

---

## 7. Vite Bundle Size Analysis
Analyze what libraries and files contribute to your JavaScript chunk size.

### How to Inspect:
Run:
```bash
npx vite-bundle-visualizer
```
*(Or check the `dist/assets/` folder output generated by `npm run build`)*

### What to Check:
- [ ] Is Three.js the only large dependency (~600–700 KB minified)?
- [ ] Are there duplicate versions of React, controls, or loaders?
- [ ] Are any large data files mistakenly bundled into the JS chunks instead of being loaded on demand from `public/`?

---

## Summary Checklist

| Category | Check Item | Status |
| :--- | :--- | :--- |
| **Build** | `npm run build` succeeds in < 10 seconds without syntax errors | Passed |
| **Static Assets** | Ghost models removed from `public/` (~90 MB saved) | Passed |
| **Service Worker** | HTTP 206 Range requests bypass `sw.js` without request loops | Passed |
| **Video Preload** | Videos set to `preload="metadata"` and deferred until models load | Passed |
| **Background Tabs** | Videos automatically pause on `visibilitychange` when tab is inactive | Passed |
| **Favicon** | Correctly resolved at `/ACM_logo.png` with MIME `image/png` | Passed |
| **FPS Stability** | Sustained 60 FPS on desktop, > 30 FPS on 4x CPU throttle | To Verify Locally |
| **Mobile Memory** | No WebGL context loss or tab crashes on mobile emulation | To Verify Locally |
