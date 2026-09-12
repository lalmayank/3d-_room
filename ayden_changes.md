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
