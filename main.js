  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

  let isIntroPlaying = true;
  let introStartTime = 0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); 

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(45, -12, 40); 

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xaad3ff, 1.0); 
  scene.add(ambientLight);

  const roomFillLight = new THREE.PointLight(0xfff0dd, 250, 200);
  roomFillLight.position.set(-15, 12, 0); 
  roomFillLight.castShadow = true;
  roomFillLight.shadow.mapSize.width = 2048;
  roomFillLight.shadow.mapSize.height = 2048;
  roomFillLight.shadow.bias = -0.001;
  scene.add(roomFillLight);

  const northWall = new THREE.Group(); 
  northWall.position.set(0, 0, -45); 
  scene.add(northWall);

  const southWall = new THREE.Group(); 
  southWall.position.set(0, 0, 45); 
  scene.add(southWall);

  const westWall = new THREE.Group();  
  westWall.position.set(-60, 0, 0); 
  scene.add(westWall);

  const eastWall = new THREE.Group();  
  eastWall.position.set(60, 0, 0); 
  scene.add(eastWall);

  const innerWall = new THREE.Group(); 
  innerWall.position.set(30, 0, -15);  
  scene.add(innerWall);

  const sun1 = new THREE.DirectionalLight(0xffcba3, 5.0);
  sun1.position.set(45, 10, -60); 
  sun1.target.position.set(45, -5, 20); 
  sun1.castShadow = true;
  sun1.shadow.mapSize.width = 2048;
  sun1.shadow.mapSize.height = 2048;
  sun1.shadow.camera.near = 0.5;
  sun1.shadow.camera.far = 150;
  sun1.shadow.camera.left = -50;
  sun1.shadow.camera.right = 50;
  sun1.shadow.camera.top = 50;
  sun1.shadow.camera.bottom = -50;
  sun1.shadow.bias = -0.0005;
  scene.add(sun1);
  scene.add(sun1.target);

  const sun2 = new THREE.DirectionalLight(0xffcba3, 6.0);
  sun2.position.set(-15, 10, -60); 
  sun2.target.position.set(-15, -5, 20);
  sun2.castShadow = true;
  sun2.shadow.mapSize.width = 2048;
  sun2.shadow.mapSize.height = 2048;
  sun2.shadow.camera.near = 0.5;
  sun2.shadow.camera.far = 150;
  sun2.shadow.camera.left = -50;
  sun2.shadow.camera.right = 50;
  sun2.shadow.camera.top = 50;
  sun2.shadow.camera.bottom = -50;
  sun2.shadow.bias = -0.0005;
  scene.add(sun2);
  scene.add(sun2.target);

  const loader = new GLTFLoader();
  
  let modelsLoaded = 0;
  function checkLoad() {
    modelsLoaded++;
    if (modelsLoaded >= 8) { 
      document.getElementById('loading').style.display = 'none';
      introStartTime = performance.now(); 
    }
  }
  function handleLoadError(error) {
    console.error("MODEL LOAD ERROR:", error);
    checkLoad(); 
  }
  
  loader.load('damaged_concrete_tiles__tile_texture.glb', function (gltf) {
      let brickMaterial = null;

      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) brickMaterial = child.material;
      });

      if (brickMaterial) {
        brickMaterial.side = THREE.DoubleSide; 
        const maps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'];
        maps.forEach(mapName => {
          if (brickMaterial[mapName]) {
            brickMaterial[mapName].wrapS = THREE.RepeatWrapping;
            brickMaterial[mapName].wrapT = THREE.RepeatWrapping;
            brickMaterial[mapName].repeat.set(15, 10); 
          }
        });

        const northGeo = new THREE.BoxGeometry(120, 30, 4);
        const northMesh = new THREE.Mesh(northGeo, brickMaterial);
        northWall.add(northMesh);

        const sideGeo = new THREE.BoxGeometry(90, 30, 4);
        const westMesh = new THREE.Mesh(sideGeo, brickMaterial);
        westMesh.rotation.y = Math.PI / 2;
        westWall.add(westMesh);

        const eastMesh = new THREE.Mesh(sideGeo, brickMaterial);
        eastMesh.rotation.y = -Math.PI / 2;
        eastWall.add(eastMesh);

        const southGeo = new THREE.BoxGeometry(90, 30, 4);
        const southMesh = new THREE.Mesh(southGeo, brickMaterial);
        southMesh.rotation.y = Math.PI;
        southMesh.position.set(-15, 0, 0); 
        southWall.add(southMesh);

        const innerGeo = new THREE.BoxGeometry(30, 30, 4);
        
        const innerMeshBack = new THREE.Mesh(innerGeo, brickMaterial);
        innerMeshBack.rotation.y = Math.PI / 2;
        innerMeshBack.position.set(0, 0, -15); 
        innerWall.add(innerMeshBack);

        const innerMeshFront = new THREE.Mesh(innerGeo, brickMaterial);
        innerMeshFront.rotation.y = Math.PI / 2;
        innerMeshFront.position.set(0, 0, 45); 
        innerWall.add(innerMeshFront);

        const ceilingGeo = new THREE.BoxGeometry(120, 4, 90);
        const ceilingMesh = new THREE.Mesh(ceilingGeo, brickMaterial);
        ceilingMesh.position.set(0, 17, 0);
        scene.add(ceilingMesh);

        const floorMesh = new THREE.Mesh(ceilingGeo, brickMaterial);
        floorMesh.position.set(0, -17, 0);
        scene.add(floorMesh);

        const spawnGeo = new THREE.BoxGeometry(30, 30, 4);
        const spawnMesh = new THREE.Mesh(spawnGeo, brickMaterial);
        spawnMesh.rotation.y = Math.PI;
        spawnMesh.position.set(45, 0, 45);
        scene.add(spawnMesh);

        [northMesh, westMesh, eastMesh, southMesh, innerMeshBack, innerMeshFront, ceilingMesh, floorMesh, spawnMesh].forEach(m => {
          m.receiveShadow = true;
          m.castShadow = true;
        });
      }
      checkLoad();
  }, undefined, handleLoadError);

  loader.load('table.glb', function (gltf) {
      const table = gltf.scene;
      table.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      table.position.set(-15, -15.2, 0); 
      table.rotation.y = Math.PI / 2; 
      table.scale.set(4, 4, 4); 
      scene.add(table);
      checkLoad();
  }, undefined, handleLoadError);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('image.png', function(texture) {
      const blueprintGeo = new THREE.PlaneGeometry(20, 12); 
      const blueprintMat = new THREE.MeshStandardMaterial({ 
        map: texture, 
        roughness: 0.9, 
        metalness: 0.0,
        transparent: true 
      });
      const blueprint = new THREE.Mesh(blueprintGeo, blueprintMat);
      blueprint.receiveShadow = true;
      blueprint.castShadow = true;
      blueprint.rotation.x = -Math.PI / 2;
      blueprint.rotation.z = Math.PI / 2; 
      blueprint.position.set(-15, -4.75, 0); 
      scene.add(blueprint);
  });

  const boardTextureLoader = new THREE.TextureLoader();
  boardTextureLoader.load('board_evidence.jpg', function(texture) { 
      const boardImgGeo = new THREE.PlaneGeometry(32, 21); 
      const boardImgMat = new MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const boardImg = new THREE.Mesh(boardImgGeo, boardImgMat);
      boardImg.receiveShadow = true;
      boardImg.castShadow = true;
      boardImg.rotation.y = Math.PI / 2; 
      boardImg.position.set(-57.9, 5.5, 0); 
      scene.add(boardImg); 
  });

  loader.load('psx_-_corkevidence_board_2.glb', function (gltf) {
      const board1 = gltf.scene;
      board1.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      const box = new THREE.Box3().setFromObject(board1);
      const center = box.getCenter(new THREE.Vector3());
      board1.position.set(-center.x, -center.y, -center.z);
      
      const board1Wrapper = new THREE.Group();
      board1Wrapper.add(board1);
      board1Wrapper.scale.set(400, 400, 400); 
      board1Wrapper.position.set(-15, 5, 42.5); 
      board1Wrapper.rotation.y = Math.PI; 
      scene.add(board1Wrapper); 

      const board2 = board1.clone();
      const board2Wrapper = new THREE.Group();
      board2Wrapper.add(board2);
      board2Wrapper.scale.set(400, 400, 400); 
      board2Wrapper.position.set(-57.5, 5, 0); 
      board2Wrapper.rotation.y = Math.PI / 2; 
      scene.add(board2Wrapper); 
      checkLoad();
  }, undefined, handleLoadError);

  loader.load('wooden_chair.glb', function (gltf) {
      const chair = gltf.scene;
      chair.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      chair.position.set(-15, -15, 20); 
      chair.scale.set(12, 12, 12); 
      chair.rotation.y = Math.PI / 8;
      scene.add(chair);
      checkLoad();
  }, undefined, handleLoadError);

  loader.load('bucket_bench_19th_century.glb', function (gltf) {
      const bench = gltf.scene;
      bench.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      bench.position.set(-45, -15, -35); 
      bench.scale.set(15, 15, 15); 
      scene.add(bench);
      checkLoad();
  }, undefined, handleLoadError);

  loader.load('file_cabinet.glb', function (gltf) {
      const cabinetModel = gltf.scene;
      cabinetModel.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      
      // Auto-center the file cabinet so its origin is its exact geometric center
      const box = new THREE.Box3().setFromObject(cabinetModel);
      const center = box.getCenter(new THREE.Vector3());
      cabinetModel.position.set(-center.x, -center.y, -center.z);

      const cabinetWrapper = new THREE.Group();
      cabinetWrapper.add(cabinetModel);

      // Now placing this at (-45, 35) guarantees the visual center is exactly here!
      // Since we centered Y, we need to snap the bottom to the floor (-15)
      cabinetWrapper.scale.set(10, 10, 10);
      cabinetWrapper.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(cabinetWrapper);
      const heightOffset = cabinetWrapper.position.y - scaledBox.min.y;
      
      cabinetWrapper.position.set(-45, -15 + heightOffset, 35); 
      cabinetWrapper.rotation.y = Math.PI; 
      
      // Save top Y coordinate so the folder can snap to it!
      window.cabinetTopY = scaledBox.max.y;

      scene.add(cabinetWrapper);
      checkLoad();
  }, undefined, handleLoadError);

  // Load Document File Folder (on top of cabinet)
  loader.load('document_file_folder.glb', function (gltf) {
      const folderModel = gltf.scene;
      folderModel.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      
      // Auto-center the folder
      const box = new THREE.Box3().setFromObject(folderModel);
      const center = box.getCenter(new THREE.Vector3());
      folderModel.position.set(-center.x, -center.y, -center.z);

      const folderWrapper = new THREE.Group();
      folderWrapper.add(folderModel);

      // Auto-scale to ~3 units wide
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.z);
      const targetScale = 3 / maxDim;
      folderWrapper.scale.set(targetScale, targetScale, targetScale);

      // Snap exactly to the top of the cabinet, regardless of load order!
      const snapInterval = setInterval(() => {
          if (window.cabinetTopY !== undefined) {
              // Get the scaled bottom of the folder to perfectly rest it on top
              folderWrapper.updateMatrixWorld(true);
              const fBox = new THREE.Box3().setFromObject(folderWrapper);
              const fOffset = folderWrapper.position.y - fBox.min.y;
              
              folderWrapper.position.set(-90, window.cabinetTopY + fOffset, 35);
              clearInterval(snapInterval);
          }
      }, 100);
      
      // Rotate it slightly for a messy look
      folderWrapper.rotation.y = Math.PI / 6;

      scene.add(folderWrapper);
      checkLoad();
  }, undefined, handleLoadError);

  loader.load('psx_style_wooden_bookshelf_low_poly.glb', function (gltf) {
      const bookshelfModel = gltf.scene;
      
      bookshelfModel.traverse(child => { 
          if (child.isMesh) { 
              child.castShadow = true; 
              child.receiveShadow = true; 
          } 
      });
      
      const box = new THREE.Box3().setFromObject(bookshelfModel);
      const center = box.getCenter(new THREE.Vector3());
      bookshelfModel.position.set(-center.x, -center.y, -center.z);

      const bookshelfWrapper = new THREE.Group();
      bookshelfWrapper.add(bookshelfModel);

      const size = box.getSize(new THREE.Vector3());
      const targetScale = 22 / size.y;
      bookshelfWrapper.scale.set(targetScale, targetScale, targetScale);

      bookshelfWrapper.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(bookshelfWrapper);
      
      const heightOffset = bookshelfWrapper.position.y - scaledBox.min.y;

      bookshelfWrapper.position.set(5, -15 + heightOffset, -40); 
      bookshelfWrapper.rotation.y = -Math.PI / 2; 
      
      scene.add(bookshelfWrapper);
      checkLoad();
  }, undefined, handleLoadError);

  const skyGeo = new THREE.PlaneGeometry(16, 18);

  const video1 = document.getElementById('windowVideo');
  video1.playbackRate = 1.8; 
  
  const tex1 = new THREE.VideoTexture(video1);
  tex1.colorSpace = THREE.SRGBColorSpace;
  tex1.minFilter = THREE.LinearFilter;
  tex1.magFilter = THREE.LinearFilter;
  tex1.generateMipmaps = false; 

  const video2 = document.getElementById('windowVideoRoom');
  const tex2 = new THREE.VideoTexture(video2);
  tex2.colorSpace = THREE.SRGBColorSpace;
  tex2.minFilter = THREE.LinearFilter;
  tex2.magFilter = THREE.LinearFilter;
  tex2.generateMipmaps = false;

  const canvas1Shadow = document.createElement('canvas');
  canvas1Shadow.width = 854;
  canvas1Shadow.height = 480;
  const ctx1Shadow = canvas1Shadow.getContext('2d', { alpha: false, willReadFrequently: false });
  ctx1Shadow.filter = 'grayscale(100%) brightness(150%) contrast(200%)';
  
  const tex1Shadow = new THREE.CanvasTexture(canvas1Shadow);
  tex1Shadow.colorSpace = THREE.SRGBColorSpace;
  tex1Shadow.minFilter = THREE.LinearFilter;
  tex1Shadow.magFilter = THREE.LinearFilter;
  tex1Shadow.generateMipmaps = false;

  let lastVidTime = 0;
  function updateShadowMask() {
    requestAnimationFrame(updateShadowMask);
    const now = performance.now();
    if (now - lastVidTime > 33) { 
      if (video1.readyState >= video1.HAVE_CURRENT_DATA) {
        ctx1Shadow.drawImage(video1, 0, 0, canvas1Shadow.width, canvas1Shadow.height);
        tex1Shadow.needsUpdate = true;
      }
      lastVidTime = now;
    }
  }
  updateShadowMask();

  function setupAutoCrop(video, texture) {
    video.addEventListener('loadedmetadata', function() {
      const videoAspect = video.videoWidth / video.videoHeight;
      const planeAspect = 16 / 18;
      if (videoAspect > planeAspect) {
        const scale = planeAspect / videoAspect;
        texture.repeat.set(scale, 1);
        texture.offset.set((1 - scale) / 2, 0);
      } else {
        const scale = videoAspect / planeAspect;
        texture.repeat.set(1, scale);
        texture.offset.set(0, (1 - scale) / 2);
      }
    });
  }
  setupAutoCrop(video1, tex1);
  setupAutoCrop(video1, tex1Shadow);
  setupAutoCrop(video2, tex2);

  const skyMat = new THREE.MeshBasicMaterial({ map: tex1 }); 
  const skyMatRoom = new THREE.MeshBasicMaterial({ map: tex2 });

  document.body.addEventListener('click', () => { 
    video1.play(); 
    video2.play();
  }, { once: true });
  
  const sky1 = new THREE.Mesh(skyGeo, skyMat);
  sky1.position.set(45, 5, -42.5); 
  scene.add(sky1);

  const projectorLight = new THREE.SpotLight(0xffffff, 1500);
  projectorLight.position.set(45, 10, -43); 
  projectorLight.target.position.set(45, -15, 10); 
  projectorLight.angle = Math.PI / 4;
  projectorLight.penumbra = 0.2;
  projectorLight.decay = 2;
  projectorLight.distance = 150;
  projectorLight.castShadow = true;
  projectorLight.map = tex1Shadow; 
  
  scene.add(projectorLight);
  scene.add(projectorLight.target);

  const sky2 = new THREE.Mesh(skyGeo, skyMatRoom);
  sky2.position.set(-15, 5, -42.5);
  scene.add(sky2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enabled = false; 
  controls.enableZoom = false; 
  controls.enablePan = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 0.1; 
  controls.minPolarAngle = Math.PI / 3;   
  controls.maxPolarAngle = Math.PI / 1.7; 

  const lookDir = new THREE.Vector3(0, 0, -1).normalize(); 
  controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
  controls.update();

  const keys = { w: false, a: false, s: false, d: false };
  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = true;
  });
  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = false;
  });

  // --- 360 ANALOG JOYSTICK LOGIC ---
  let joyDeltaX = 0;
  let joyDeltaY = 0;
  const joyZone = document.getElementById('joystick-zone');
  const joyStick = document.getElementById('joystick-stick');
  const joyMax = 35; // How far the stick can move visually
  
  function handleJoy(e) {
    e.preventDefault();
    if (e.touches && e.touches.length === 0) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = joyZone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > joyMax) {
      dx = dx * (joyMax / distance);
      dy = dy * (joyMax / distance);
    }
    
    joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
    joyDeltaX = dx / joyMax;
    joyDeltaY = dy / joyMax;
  }
  
  function resetJoy() {
    joyStick.style.transform = `translate(0px, 0px)`;
    joyDeltaX = 0;
    joyDeltaY = 0;
  }

  joyZone.addEventListener('touchstart', handleJoy, {passive: false});
  joyZone.addEventListener('touchmove', handleJoy, {passive: false});
  joyZone.addEventListener('touchend', resetJoy);
  joyZone.addEventListener('touchcancel', resetJoy);
  
  let isJoyDown = false;
  joyZone.addEventListener('mousedown', (e) => { isJoyDown = true; handleJoy(e); });
  window.addEventListener('mousemove', (e) => { if (isJoyDown) handleJoy(e); });
  window.addEventListener('mouseup', () => { if (isJoyDown) { isJoyDown = false; resetJoy(); } });

  let cutsceneTableTriggered = false;
  let cutsceneBoardTriggered = false;
  let cutsceneWindowTriggered = false;
  let cutsceneCabinetTriggered = false;

  document.getElementById('cutscene-cabinet').addEventListener('click', function() {
    this.classList.remove('active');
    camera.position.set(-35, 0, 35); 
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    controls.target.copy(camera.position).addScaledVector(forward, 0.1);
    controls.update();
    setTimeout(() => { cutsceneCabinetTriggered = false; }, 1000);
  });

  document.getElementById('cutscene-window').addEventListener('click', function() {
    this.classList.remove('active');
    camera.position.set(-15, 0, -25); 
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    controls.target.copy(camera.position).addScaledVector(forward, 0.1);
    controls.update();
    setTimeout(() => { cutsceneWindowTriggered = false; }, 1000);
  });

  document.getElementById('cutscene-table').addEventListener('click', function() {
    this.classList.remove('active');
    document.getElementById('newspaper-overlay').classList.remove('thrown');
    camera.position.set(5, 0, 10); 
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    controls.target.copy(camera.position).addScaledVector(forward, 0.1);
    controls.update();
    setTimeout(() => { cutsceneTableTriggered = false; }, 1000);
  });

  document.getElementById('cutscene-board').addEventListener('click', function() {
    this.classList.remove('active');
    camera.position.set(-30, 0, 0); 
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    controls.target.copy(camera.position).addScaledVector(forward, 0.1);
    controls.update();
    setTimeout(() => { cutsceneBoardTriggered = false; }, 1000);
  });

  function isValidPosition(x, z) {
    const inPassage = (x > 32 && x < 58 && z > -42 && z < 42);
    const inMainRoom = (x > -56 && x < 28 && z > -42 && z < 42);
    const inOpening = (x >= 28 && x <= 32 && z > -15 && z < 15); 
    const withinWalls = inPassage || inMainRoom || inOpening;

    if (!withinWalls) return false;

    const hitTable = (x > -27 && x < -3 && z > -10 && z < 10);
    const hitChair = (x > -20 && x < -10 && z > 5 && z < 15);
    const hitBench = (x > -50 && x < -40 && z > -40 && z < -30);
    const hitCabinet = (x > -50 && x < -40 && z > 30 && z < 40);
    const hitBookshelf = (x > -44 && x < -32 && z > 12 && z < 28); 

    if (hitTable || hitChair || hitBench || hitCabinet || hitBookshelf) return false;

    return true;
  }

  function animate() {
    requestAnimationFrame(animate);
    
    // --- SLOWER WAKE UP INTRO SEQUENCE LOGIC ---
    if (isIntroPlaying && introStartTime > 0) {
      const elapsed = (performance.now() - introStartTime) / 1000; 
      const blink = document.getElementById('blink-overlay');
      let forward = new THREE.Vector3(0, 0, -1);
      
      const smoothStep = (t) => t * t * (3 - 2 * t);

      // Stretched timeline to 14 seconds for a groggy, natural wake up
      if (elapsed < 2.5) {
        // Slowly crack eyes open over 2.5 seconds (opacity down to 0.3)
        let t = elapsed / 2.5;
        blink.style.opacity = 1 - (t * 0.7);
      } else if (elapsed < 3.0) {
        // Heavy blink closed for 0.5s
        blink.style.opacity = 1.0;
      } else if (elapsed < 5.0) {
        // Open eyes fully over 2 seconds
        let t = (elapsed - 3.0) / 2.0;
        blink.style.opacity = 1 - t;
      } else if (elapsed < 7.5) {
        // Look Left (taking 2.5 seconds)
        let t = Math.min((elapsed - 5.0) / 2.5, 1.0);
        let ease = smoothStep(t);
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), ease * 1.2); 
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 10.0) {
        // Look Right (taking 2.5 seconds)
        let t = Math.min((elapsed - 7.5) / 2.5, 1.0);
        let ease = smoothStep(t);
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), 1.2 - (ease * 2.4)); 
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 11.5) {
        // Look Center (taking 1.5 seconds)
        let t = Math.min((elapsed - 10.0) / 1.5, 1.0);
        let ease = smoothStep(t);
        forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), -1.2 + (ease * 1.2)); 
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 14.0) {
        // Stand Up off the floor (taking 2.5 seconds)
        let t = Math.min((elapsed - 11.5) / 2.5, 1.0);
        let ease = smoothStep(t);
        camera.position.y = -12 + (ease * 12); 
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else {
        // Intro complete! Give player control.
        isIntroPlaying = false;
        controls.enabled = true; 
        camera.position.y = 0; // Explicitly enforce standing height
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
        if(blink) blink.style.display = 'none'; 
      }
    }

    const speed = 0.4; 
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; 
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).normalize();

    let moveX = 0;
    let moveZ = 0;

    if (!isIntroPlaying) {
      // 1. Calculate Keyboard Input (-1 to 1)
      let keyX = 0; let keyY = 0;
      if (keys.w) keyY -= 1;
      if (keys.s) keyY += 1;
      if (keys.a) keyX -= 1;
      if (keys.d) keyX += 1;

      // 2. Combine Keyboard and Joystick (use whichever is active)
      let inputX = joyDeltaX || keyX;
      let inputY = joyDeltaY || keyY;

      // 3. Apply to world movement vectors
      moveX += forward.x * speed * -inputY;
      moveZ += forward.z * speed * -inputY;
      
      moveX += right.x * speed * -inputX;
      moveZ += right.z * speed * -inputX;
    }

    const nextX = camera.position.x + moveX;
    if (isValidPosition(nextX, camera.position.z)) {
      camera.position.x = nextX;
      controls.target.x += moveX;
    }

    const nextZ = camera.position.z + moveZ;
    if (isValidPosition(camera.position.x, nextZ)) {
      camera.position.z = nextZ;
      controls.target.z += moveZ;
    }

    const canTriggerCutscene = !isIntroPlaying && !cutsceneTableTriggered && !cutsceneBoardTriggered && !cutsceneWindowTriggered && !cutsceneCabinetTriggered;

    if (canTriggerCutscene) {
      const isNearTable = camera.position.x > -30 && camera.position.x < 0 &&
                          camera.position.z > -15 && camera.position.z < 15;

      if (isNearTable) {
        cutsceneTableTriggered = true;
        document.getElementById('cutscene-table').classList.add('active');
        setTimeout(() => { document.getElementById('newspaper-overlay').classList.add('thrown'); }, 600); 
      }
    }

    if (canTriggerCutscene) {
      const isNearWindow = camera.position.x > -25 && camera.position.x < -5 && 
                           camera.position.z < -30;
      if (isNearWindow) {
        cutsceneWindowTriggered = true;
        document.getElementById('cutscene-window').classList.add('active');
      }
    }

    if (canTriggerCutscene) {
      const isNearLeftBoard = camera.position.x < -40 && 
                              camera.position.z > -15 && camera.position.z < 15;
      if (isNearLeftBoard) {
        cutsceneBoardTriggered = true;
        document.getElementById('cutscene-board').classList.add('active');
      }
    }

    if (canTriggerCutscene) {
      const isNearCabinet = camera.position.x < -35 && camera.position.z > 25;
      if (isNearCabinet) {
        cutsceneCabinetTriggered = true;
        document.getElementById('cutscene-cabinet').classList.add('active');
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
