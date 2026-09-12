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
