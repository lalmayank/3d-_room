# Changes Made by Ayden

## 1. South Board 3D Texture Alignment
- **File Modified:** `main.js`
- **Description:** Updated the South Wall board (`board1`) Three.js Plane mesh geometry to cleanly fit within its inner wooden frame (`width: 32`, `height: 21`). Repositioned the mesh slightly proud of the cork surface (`z = 42.2`) to prevent z-fighting while preserving the visibility of the outer frame.

## 2. West Board 3D Texture Alignment
- **File Modified:** `main.js`
- **Description:** Updated the West Wall board (`board2`, which displays the ACM logo) Three.js Plane mesh geometry to cleanly fit within its inner wooden frame (`width: 32`, `height: 21`). Repositioned the mesh slightly proud of the cork surface (`x = -57.6`) to prevent z-fighting while preserving the visibility of the outer frame.

## 3. Table Cutscene Proximity Fix
- **File Modified:** `main.js`
- **Description:** Tightened the bounding box for the table cutscene (`isNearTable`). The previous bounds were too large (spanning `x` from -30 to 0 and `z` from -15 to 15), causing the cutscene to glitch and trigger incorrectly from the middle of the room. The new tighter bounds (`x` between -28 and -2, `z` between -5 and 5) ensure the event only triggers when the user walks directly up to the table.

## 4. Service Worker Cache Invalidation Fix
- **File Modified:** `sw.js`
- **Description:** Updated the Service Worker (`sw.js`) to fix persistent caching issues that were preventing code updates from loading in the browser. Bumped the `CACHE_NAME` to `v2` to force an immediate cache clear for returning users, and added explicit cache bypass rules for development files (`.js`, `.css`, `.html`, `/`) so future updates are instantly recognized without manual hard refreshes.

## 5. Smooth Loading and Wake-Up Animation
- **File Modified:** `main.js`, `style.css`
- **Description:** Improved the initial experience to be significantly smoother. The loading screen now fades out gracefully using a CSS transition. Camera movements when returning from cutscenes now lerp smoothly back into position instead of abruptly teleporting, and the cinematic "Wake Up" sequence has been smoothed to eliminate camera jolts.

## 6. Controls Helper UI
- **File Modified:** `index.html`, `style.css`
- **Description:** Added a sleek, glassmorphic controls helper card to the bottom-right of the screen so that desktop players can easily see the navigation instructions. The WASD keys were styled with CSS flexbox and 3D borders to physically resemble a cluster of keyboard keys. This card is automatically hidden on mobile devices, which instead use the built-in joystick toggle.

## 7. Port Forwarding Asset Loading Fix
- **File Modified:** main.js
- **Description:** Replaced a hardcoded 3.5-second safety fallback timeout with THREE.LoadingManager for the GLTFLoader. Previously, over a slow forwarded port connection, the timeout would trigger and drop the user into an empty room before the heavy walls and props could finish downloading. Now, all 8 models still load simultaneously (maximizing network efficiency), but the loading screen is guaranteed to stay up until 100% of the assets are loaded. Additionally, real-time download percentage progress is now displayed so the user knows the page isn't frozen on slower connections.

## 8. Migration to React + Vite Architecture
- **File Modified:** `package.json`, `vite.config.js`, `src/App.jsx`, `src/UI.jsx`, `src/main.jsx`, `src/main_logic.js`, `src/index.css`
- **Description:** Converted the application from vanilla HTML/CSS/JS into a modern React 18 + Vite SPA on branch `new_layout`. Three.js canvas initialization and animation loop were encapsulated within `App.jsx` and `main_logic.js`, HUD overlay elements (WASD guide, virtual joystick, cutscenes, loading screen) were modularized into `UI.jsx`, and TailwindCSS styling was integrated.

## 9. Favicon Path & MIME Type Resolution
- **File Modified:** `index.html`
- **Description:** Fixed broken protocol-relative favicon reference `href="//ACM_logo.png"` to `/ACM_logo.png` and updated the MIME type from `image/svg+xml` to `image/png`, eliminating browser console network errors (`ERR_NAME_NOT_RESOLVED`) when resolving the tab icon.

## 10. Public Asset Directory Optimization & Ghost Model Archiving
- **File Modified:** `public/`, `archive/`, `.gitignore`
- **Description:** Identified and removed ~90 MB of unreferenced 3D models (`interior_7.glb`, `bookshelf (1).glb`, `investigation_board (1).glb`, `free_dirty_low_poly_window.glb`) from `public/` and moved them into a dedicated `archive/` folder outside the bundle tree, drastically reducing the production `dist/` build output size. Added `archive/` to `.gitignore` to avoid bloating Git repository commits.

## 11. Window Video Path Standardization & Frame Decoding Fix
- **File Modified:** `public/videos/`, `src/UI.jsx`, `src/main_logic.js`, `main.js`
- **Description:** Reorganized streaming window background videos into a standardized `public/videos/` directory (lowercase) to prevent case-sensitivity routing failures on Linux/production environments. Resolved a critical issue where CSS `visibility: hidden; width: 0; height: 0;` caused Chromium and Safari to suspend video frame decoding (resulting in pitch black window textures) by updating video elements to active compositor styles (`position: fixed; width: 1px; height: 1px; opacity: 0.001; pointer-events: none`). Set direct `src` attributes on `<video>` elements and removed redundant child `<source>` tags.

## 12. Autoplay Policy & Muted Property Handling in Three.js
- **File Modified:** `src/main_logic.js`, `main.js`
- **Description:** Resolved browser autoplay blocks caused by React JSX's `muted` attribute bug by explicitly assigning `video.muted = true`, `video.defaultMuted = true`, and `video.playsInline = true` via JavaScript. Added immediate metadata checks (`readyState >= 1`) in `setupAutoCrop` to ensure texture aspect ratio and cropping offsets calculate even if metadata resolves early. In the `animate()` render loop, added texture `needsUpdate = true` flags to push freshly decoded video frames into WebGL textures.

## 13. Service Worker Range Request Infinite Loop & Server Crash Fix
- **File Modified:** `public/sw.js`
- **Description:** Resolved a critical deployment-crashing bug where the Service Worker intercepted video streaming requests. Because the browser Cache Storage API cannot handle HTTP 206 Partial Content (Range) requests, piping 206 responses through `event.respondWith()` broke the browser's media buffer, triggering an infinite high-frequency request loop of hundreds of Range requests per second that overwhelmed and crashed web servers. Added an explicit bypass in `sw.js` for all video formats (`.mp4`, `.webm`, `.ogg`) and requests with `Range` headers, delegating streaming directly to the browser's native networking pipeline. Bumped `CACHE_NAME` to `acm-cellar-cache-v3` to automatically purge stale caches on client devices.

## 14. Network Bandwidth Staggering & Tab Visibility Management
- **File Modified:** `src/UI.jsx`, `src/main_logic.js`, `main.js`
- **Description:** Changed video preloading from `preload="auto"` to `preload="metadata"` in `UI.jsx` so browsers do not greedily download 140+ MB of video data during initial page load. Deferred video playback until `manager.onLoad` fires (when 100% of the 3D room GLTF models have completed downloading), allocating full bandwidth to the 3D scene first. Added a `visibilitychange` event listener to pause window videos when the browser tab is hidden and resume when visible, eliminating wasted server bandwidth.

## 15. LCP Optimization: Metric Decoupling, 82% Model Compression & Progressive Staging
- **File Modified:** `public/*.glb`, `src/UI.jsx`, `src/main_logic.js`, `main.js`, `src/index.css`, `style.css`
- **Root Cause of 20.24s LCP:**
  - Because WebGL `<canvas>` graphics are not treated as contentful text or image elements by Chromium's Core Web Vitals engine, the largest element in the viewport during page load was `div#loading`.
  - In the previous code, `manager.onProgress` repeatedly modified `loadingEl.innerText` (`12%` → `25%` → `...` → `100%`). Under Lighthouse / Core Web Vitals rules, updating a text node invalidates previous paints and creates a new candidate LCP timestamp.
  - The final model finished downloading at 20.24 seconds, causing the final text paint at 20.24s to be recorded as the Largest Contentful Paint.
- **LCP Decoupling & Hero Branding Paint:**
  - Converted the loading overlay in `src/UI.jsx` into a semantic hero element with a permanent `<h1>` header (`THE CELLAR`) and subtitle that paints immediately on frame 0 (< 0.8s).
  - Replaced DOM text node churn (`loadingEl.innerText = ...`) with a GPU-accelerated CSS progress bar (`#loading-bar-fill` using `transform: scaleX(...)`), which does not trigger DOM layout reflows or re-evaluate the LCP metric.
- **Model Texture Resizing & Draco Geometry Compression (230 MB → 41.2 MB, -82%):**
  - Inspected 3D model assets and discovered uncompressed 4096×4096 (4K) textures and uncompressed high-poly meshes:
    - `table.glb`: 65.64 MB → **5.77 MB** (-91.2%) via 1024×1024 texture resizing.
    - `document_file_folder.glb`: 51.50 MB → **7.08 MB** (-86.3%) via 1024×1024 texture resizing (was consuming 536 MB of VRAM for a 1,000-vertex model).
    - `damaged_concrete_tiles__tile_texture.glb`: 56.17 MB → **4.14 MB** (-92.6%) via Draco geometry compression.
    - `file_cabinet.glb`: 15.02 MB → **4.32 MB** (-71.2%) via texture resizing.
    - `wooden_chair.glb`: 13.74 MB → **5.47 MB** (-61.9%) via texture resizing.
    - `bucket_bench_19th_century.glb`: 27.53 MB → **13.77 MB** (-50.0%) via texture resizing.
  - Integrated `DRACOLoader` in both `src/main_logic.js` and `main.js` using official Google CDN WebAssembly decoders.
- **Progressive Staged Loading:**
  - Segmented asset loading into **Stage 1 (Core Shell)** and **Stage 2 (Background Props)**:
    - Stage 1 loads only `damaged_concrete_tiles`, `table`, and `wooden_chair` (~15 MB total payload).
    - Once Stage 1 finishes (< 2s), `#loading-container` fades out immediately and the 11-second cinematic wake-up animation begins.
    - Stage 2 (`file_cabinet`, `bucket_bench`, `bookshelf`, `document_file_folder`, and corkboard) loads asynchronously in the background during the 11-second cinematic animation, so the user never encounters an artificial wait screen.

## 16. Production Preview Proximity Cutscene Path & Autoplay Fixes
- **File Modified:** `src/index.css`, `style.css`, `src/UI.jsx`, `src/main_logic.js`, `main.js`
- **Description:**
  - Fixed relative CSS background image paths `url('tabletop.jpg')` and `url('board.jpeg')` to absolute paths `/tabletop.jpg` and `/board.jpeg` in both `src/index.css` and `style.css`. In production builds (`npm run preview`), relative URLs resolved to `dist/assets/*.jpg` and returned SPA `index.html` fallback 404 responses, leaving tabletop and board proximity cutscenes completely pitch black.
  - Fixed newspaper overlay image reference in `src/UI.jsx` to root path `/image.png`.
  - Added explicit JavaScript property assignments `cutscenePlayer.muted = true`, `cutscenePlayer.defaultMuted = true`, and `cutscenePlayer.playsInline = true` in `src/main_logic.js` and `main.js` to bypass React 18's JSX `muted` DOM property bug that caused browser autoplay policy to reject `.play()` calls on `#cutscene-window-player`.
  - Added safety guard checking `cutsceneVid.readyState >= 1` before setting `cutsceneVid.currentTime = video2.currentTime` with a fallback `loadedmetadata` listener, preventing media seek `InvalidStateError` aborts when approaching the window.


