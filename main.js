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

  const ambientLight = new THREE.AmbientLight(0xaad3ff, 0.8); 
  scene.add(ambientLight);

  const roomFillLight = new THREE.PointLight(0xfff0dd, 100, 200);
  roomFillLight.position.set(-15, 6, 0); 
  roomFillLight.castShadow = false;
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

  const sun1 = new THREE.DirectionalLight(0xffcba3, 2.5);
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

  const sun2 = new THREE.DirectionalLight(0xffcba3, 3.0);
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

      // Procedural Hardwood Parquet Tile Floor Texture
      function createWoodFloorTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Warm oak wood undertone
        ctx.fillStyle = '#6e4c33';
        ctx.fillRect(0, 0, 1024, 1024);

        const numRows = 8;
        const rowHeight = 1024 / numRows;
        const numCols = 4;
        const colWidth = 1024 / numCols;

        const plankTones = [
          '#7c583c', '#67472e', '#735036', '#5d3d25', 
          '#835e41', '#6b4c32', '#77543a', '#604128'
        ];

        for (let r = 0; r < numRows; r++) {
          const offset = (r % 2) * (colWidth / 2);
          for (let c = -1; c <= numCols; c++) {
            const x = c * colWidth + offset;
            const y = r * rowHeight;
            const toneIdx = Math.floor(Math.abs(Math.sin(r * 17 + c * 11)) * plankTones.length) % plankTones.length;
            
            ctx.fillStyle = plankTones[toneIdx];
            ctx.fillRect(x + 2, y + 2, colWidth - 4, rowHeight - 4);

            // Subtle wood grain fibers
            ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
            for (let g = 0; g < 9; g++) {
              const gy = y + 4 + g * (rowHeight / 10);
              ctx.fillRect(x + 2, gy, colWidth - 4, 1.5);
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            for (let g = 0; g < 5; g++) {
              const gy = y + 8 + g * (rowHeight / 6);
              ctx.fillRect(x + 2, gy, colWidth - 4, 1.0);
            }
          }
        }

        // Plank groove bevels (dark realistic seams)
        ctx.strokeStyle = '#2b1b12';
        ctx.lineWidth = 3;
        for (let r = 0; r <= numRows; r++) {
          ctx.beginPath();
          ctx.moveTo(0, r * rowHeight);
          ctx.lineTo(1024, r * rowHeight);
          ctx.stroke();
        }
        for (let r = 0; r < numRows; r++) {
          const offset = (r % 2) * (colWidth / 2);
          for (let c = 0; c <= numCols; c++) {
            ctx.beginPath();
            ctx.moveTo(c * colWidth + offset, r * rowHeight);
            ctx.lineTo(c * colWidth + offset, (r + 1) * rowHeight);
            ctx.stroke();
          }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(12, 9);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      }

      const woodFloorTex = createWoodFloorTexture();
      const woodFloorMat = new THREE.MeshStandardMaterial({
        map: woodFloorTex,
        roughness: 0.82, // Natural matte hardwood finish - prevents harsh specular glare
        metalness: 0.02
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

        const floorMesh = new THREE.Mesh(ceilingGeo, woodFloorMat);
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

  // --- MASTERMIND COUNCIL RUG (Under Table & Chairs) ---
  function createCouncilRugTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 740;
    const ctx = canvas.getContext('2d');

    // Deep royal crimson background
    ctx.fillStyle = '#681516';
    ctx.fillRect(0, 0, 1024, 740);

    // Multi-band ornamental gold & navy borders
    ctx.strokeStyle = '#c99a38';
    ctx.lineWidth = 16;
    ctx.strokeRect(30, 30, 964, 680);

    ctx.strokeStyle = '#182638';
    ctx.lineWidth = 24;
    ctx.strokeRect(54, 54, 916, 632);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(80, 80, 864, 580);

    // Corner decorative florets
    const corners = [[90, 90], [934, 90], [90, 650], [934, 650]];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#c99a38';
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#182638';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    });

    // Central Ornate Medallion
    const centerX = 512;
    const centerY = 370;
    
    ctx.fillStyle = '#182638';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 220, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 220, 160, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#851c1d';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 150, 105, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#f1d279';
    ctx.lineWidth = 4;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(a) * 140, centerY + Math.sin(a) * 95);
      ctx.stroke();
    }

    // Fringe edges (cream fringe at top and bottom)
    ctx.fillStyle = '#ede5d0';
    for (let f = 0; f < 1024; f += 8) {
      ctx.fillRect(f, 0, 4, 18);
      ctx.fillRect(f, 722, 4, 18);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const councilRugTex = createCouncilRugTexture();
  const councilRugMat = new THREE.MeshStandardMaterial({
    map: councilRugTex,
    roughness: 0.88,
    metalness: 0.05,
    polygonOffset: true,
    polygonOffsetFactor: -1.0,
    polygonOffsetUnits: -1.0
  });
  const councilRug = new THREE.Mesh(new THREE.PlaneGeometry(36, 26), councilRugMat);
  councilRug.rotation.x = -Math.PI / 2;
  councilRug.position.set(-15, -14.95, 0);
  councilRug.receiveShadow = true;
  scene.add(councilRug);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('tabletop.jpg', function(texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      // 16:9 Aspect Ratio (19.5 x 11.0) sized to fit the wooden tabletop
      const blueprintGeo = new THREE.PlaneGeometry(19.5, 11.0); 
      const blueprintMat = new THREE.MeshStandardMaterial({ 
        map: texture, 
        roughness: 0.85, 
        metalness: 0.0,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -1.0
      });
      const blueprint = new THREE.Mesh(blueprintGeo, blueprintMat);
      blueprint.receiveShadow = true;
      blueprint.castShadow = true;
      blueprint.rotation.x = -Math.PI / 2;
      blueprint.rotation.z = Math.PI / 2; 
      blueprint.position.set(-15, -4.7, 0); 
      scene.add(blueprint);
  });

  const boardTextureLoader = new THREE.TextureLoader();
  
  // 1. South Wall Board (Left side of table) - Yearly Events Evidence Board
  boardTextureLoader.load('board.jpeg', function(texture) { 
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      const boardImgGeo = new THREE.PlaneGeometry(37.6, 23.6); 
      const boardImgMat = new THREE.MeshStandardMaterial({ 
        map: texture, 
        roughness: 0.85,
        metalness: 0.0,
        side: THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -1.0
      });

      const southBoardImg = new THREE.Mesh(boardImgGeo, boardImgMat);
      southBoardImg.position.set(-15, 5.0, 41.85);
      southBoardImg.rotation.y = Math.PI; 
      southBoardImg.receiveShadow = true;
      scene.add(southBoardImg);
  });

  // 2. West Wall Board (Behind table) - Centered ACM Chapter Board
  const acmImage = new Image();
  acmImage.src = 'acm_logo.jpeg';
  acmImage.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1285; // Matches 37.6 / 23.6 aspect ratio
      const ctx = canvas.getContext('2d');

      // Subtle gradient background blending cleanly to edges
      const bgGrad = ctx.createRadialGradient(1024, 642, 200, 1024, 642, 1200);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(0.7, '#f1f5f9');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle border trim
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 12;
      ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

      // Exact 1:1 square diamond logo centered with zero distortion
      const logoSize = 1140;
      const logoX = (canvas.width - logoSize) / 2;
      const logoY = (canvas.height - logoSize) / 2;
      ctx.drawImage(acmImage, logoX, logoY, logoSize, logoSize);

      const canvasTexture = new THREE.CanvasTexture(canvas);
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;
      canvasTexture.magFilter = THREE.LinearFilter;
      canvasTexture.generateMipmaps = true;
      if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
        canvasTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      }

      const acmBoardGeo = new THREE.PlaneGeometry(37.6, 23.6); 
      const acmBoardMat = new THREE.MeshStandardMaterial({ 
        map: canvasTexture, 
        roughness: 0.85,
        metalness: 0.0,
        side: THREE.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -1.0
      });

      const westBoardImg = new THREE.Mesh(acmBoardGeo, acmBoardMat);
      westBoardImg.position.set(-56.85, 5.0, 0); 
      westBoardImg.rotation.y = Math.PI / 2; 
      westBoardImg.receiveShadow = true;
      scene.add(westBoardImg); 
  };

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
      chair.scale.set(12, 12, 12); 

      // Chair 1 (Left flank of table)
      chair.position.set(-15, -15, 17); 
      chair.rotation.y = Math.PI / 8;
      scene.add(chair);

      // Chair 2 (Right flank of table)
      const chair2 = chair.clone();
      chair2.position.set(-15, -15, -17);
      chair2.rotation.y = Math.PI - Math.PI / 8;
      scene.add(chair2);

      // Chair 3 (Behind table / Mastermind Head Seat)
      const chair3 = chair.clone();
      chair3.position.set(-27, -15, 0);
      chair3.rotation.y = -Math.PI / 2;
      scene.add(chair3);

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

  const projectorLight = new THREE.SpotLight(0xffffff, 1000);
  projectorLight.position.set(45, 8, -41.5); 
  projectorLight.target.position.set(45, -15, 10); 
  projectorLight.angle = Math.PI / 3.5;
  projectorLight.penumbra = 0.25;
  projectorLight.decay = 1.8;
  projectorLight.distance = 150;
  projectorLight.castShadow = true;
  projectorLight.map = tex1Shadow; 
  
  scene.add(projectorLight);
  scene.add(projectorLight.target);

  const sky2 = new THREE.Mesh(skyGeo, skyMatRoom);
  sky2.position.set(-15, 5, -42.5);
  scene.add(sky2);

  // --- 3D ARCHITECTURAL WINDOW FRAMES WITH SILLS & MULLIONS ---
  function createWindowFrame(width, height, depth) {
    const frameGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e1915, 
      roughness: 0.7, 
      metalness: 0.25 
    });
    const sillMat = new THREE.MeshStandardMaterial({ 
      color: 0x16120e, 
      roughness: 0.65, 
      metalness: 0.3 
    });

    const borderThick = 0.8;
    const frameDepth = depth || 1.4;

    // Outer Top Header
    const topGeo = new THREE.BoxGeometry(width + borderThick * 2, borderThick, frameDepth);
    const topMesh = new THREE.Mesh(topGeo, frameMat);
    topMesh.position.set(0, height / 2 + borderThick / 2, 0);
    frameGroup.add(topMesh);

    // Outer Bottom Header
    const botGeo = new THREE.BoxGeometry(width + borderThick * 2, borderThick, frameDepth);
    const botMesh = new THREE.Mesh(botGeo, frameMat);
    botMesh.position.set(0, -height / 2 - borderThick / 2, 0);
    frameGroup.add(botMesh);

    // Outer Left Post
    const leftGeo = new THREE.BoxGeometry(borderThick, height, frameDepth);
    const leftMesh = new THREE.Mesh(leftGeo, frameMat);
    leftMesh.position.set(-width / 2 - borderThick / 2, 0, 0);
    frameGroup.add(leftMesh);

    // Outer Right Post
    const rightGeo = new THREE.BoxGeometry(borderThick, height, frameDepth);
    const rightMesh = new THREE.Mesh(rightGeo, frameMat);
    rightMesh.position.set(width / 2 + borderThick / 2, 0, 0);
    frameGroup.add(rightMesh);

    // Protruding Window Sill at bottom
    const sillGeo = new THREE.BoxGeometry(width + borderThick * 2 + 2.0, 0.7, frameDepth + 2.0);
    const sillMesh = new THREE.Mesh(sillGeo, sillMat);
    sillMesh.position.set(0, -height / 2 - borderThick - 0.25, 0.9);
    frameGroup.add(sillMesh);

    // Grid Mullions: Center Vertical
    const vertMullionGeo = new THREE.BoxGeometry(0.45, height, frameDepth * 0.7);
    const vertMullion = new THREE.Mesh(vertMullionGeo, frameMat);
    vertMullion.position.set(0, 0, 0);
    frameGroup.add(vertMullion);

    // Grid Mullions: Left & Right Vertical
    const subVert1 = vertMullion.clone();
    subVert1.position.set(-width / 3.4, 0, 0);
    frameGroup.add(subVert1);

    const subVert2 = vertMullion.clone();
    subVert2.position.set(width / 3.4, 0, 0);
    frameGroup.add(subVert2);

    // Grid Mullions: Horizontal Dividers
    const horizMullionGeo = new THREE.BoxGeometry(width, 0.45, frameDepth * 0.7);
    const horizMullion1 = new THREE.Mesh(horizMullionGeo, frameMat);
    horizMullion1.position.set(0, height / 3.4, 0);
    frameGroup.add(horizMullion1);

    const horizMullion2 = new THREE.Mesh(horizMullionGeo, frameMat);
    horizMullion2.position.set(0, -height / 3.4, 0);
    frameGroup.add(horizMullion2);

    // Subtle Glass Sheen Pane (does not block light or video shadows)
    const glassGeo = new THREE.PlaneGeometry(width, height);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 0, 0.1);
    glassMesh.castShadow = false;
    glassMesh.receiveShadow = false;
    frameGroup.add(glassMesh);

    [topMesh, botMesh, leftMesh, rightMesh, sillMesh, vertMullion, subVert1, subVert2, horizMullion1, horizMullion2].forEach(m => {
      m.castShadow = true;
      m.receiveShadow = true;
    });

    return frameGroup;
  }

  const windowFrame1 = createWindowFrame(16, 18, 1.4);
  windowFrame1.position.set(45, 5, -42.4);
  scene.add(windowFrame1);

  const windowFrame2 = createWindowFrame(16, 18, 1.4);
  windowFrame2.position.set(-15, 5, -42.4);
  scene.add(windowFrame2);

  // --- VINTAGE PENDANT CEILING LAMP (Over Investigation Table) ---
  const lampGroup = new THREE.Group();
  
  // Hanging black cord
  const cordGeo = new THREE.CylinderGeometry(0.06, 0.06, 8.5, 8);
  const cordMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
  const cord = new THREE.Mesh(cordGeo, cordMat);
  cord.position.set(-15, 12.75, 0);
  lampGroup.add(cord);

  // Conical metal lampshade
  const shadeGeo = new THREE.CylinderGeometry(0.6, 2.8, 1.4, 24, 1, false);
  const shadeMat = new THREE.MeshStandardMaterial({ 
    color: 0x242a26, 
    roughness: 0.4, 
    metalness: 0.7 
  });
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.position.set(-15, 8.5, 0);
  lampGroup.add(shade);

  // Warm glowing bulb
  const bulbGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe8b8 });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.set(-15, 8.1, 0);
  lampGroup.add(bulb);

  // Atmospheric warm spotlight shining down directly on tabletop
  const tableSpot = new THREE.SpotLight(0xfffae0, 220);
  tableSpot.position.set(-15, 8.0, 0);
  tableSpot.target.position.set(-15, -4.75, 0);
  tableSpot.angle = Math.PI / 3.2;
  tableSpot.penumbra = 0.5;
  tableSpot.decay = 2;
  tableSpot.distance = 22;
  tableSpot.castShadow = true;
  tableSpot.shadow.bias = -0.001;
  lampGroup.add(tableSpot);
  lampGroup.add(tableSpot.target);

  scene.add(lampGroup);

  // --- DETECTIVE DESK PROPS ---
  const deskProps = new THREE.Group();

  // 1. Classic Green Glass Banker's Desk Lamp
  const bankerLamp = new THREE.Group();
  bankerLamp.position.set(-22, -4.7, 7.5);
  bankerLamp.rotation.y = -Math.PI / 4;

  const brassMat = new THREE.MeshStandardMaterial({ 
    color: 0xd4af37, 
    metalness: 0.85, 
    roughness: 0.25 
  });
  const emeraldMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x0a4d22, 
    roughness: 0.15, 
    metalness: 0.1, 
    transmission: 0.55, 
    thickness: 0.6,
    clearcoat: 1.0 
  });

  // Stepped brass base
  const baseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.2, 24);
  const baseMesh = new THREE.Mesh(baseGeo, brassMat);
  baseMesh.position.y = 0.1;
  bankerLamp.add(baseMesh);

  // Brass vertical post and curved neck
  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
  const postMesh = new THREE.Mesh(postGeo, brassMat);
  postMesh.position.set(0, 1.0, 0);
  bankerLamp.add(postMesh);

  const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12);
  const armMesh = new THREE.Mesh(armGeo, brassMat);
  armMesh.rotation.z = Math.PI / 3;
  armMesh.position.set(-0.25, 2.0, 0);
  bankerLamp.add(armMesh);

  // Curved emerald green glass shade
  const shadeBodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.4, 24, 1, false, 0, Math.PI);
  const shadeBody = new THREE.Mesh(shadeBodyGeo, emeraldMat);
  shadeBody.rotation.z = Math.PI / 2;
  shadeBody.rotation.y = Math.PI / 2;
  shadeBody.position.set(-0.5, 2.1, 0);
  bankerLamp.add(shadeBody);

  // Glowing miniature bulb & localized warm glow
  const miniBulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const miniBulbMat = new THREE.MeshBasicMaterial({ color: 0xfff0c2 });
  const miniBulb = new THREE.Mesh(miniBulbGeo, miniBulbMat);
  miniBulb.position.set(-0.5, 1.95, 0);
  bankerLamp.add(miniBulb);

  const lampGlow = new THREE.PointLight(0xffe8a0, 45, 8, 2);
  lampGlow.position.set(-0.5, 1.85, 0);
  lampGlow.castShadow = false;
  bankerLamp.add(lampGlow);

  deskProps.add(bankerLamp);

  // 2. Detective Ceramic Coffee Mug
  const mugGroup = new THREE.Group();
  mugGroup.position.set(-22, -4.7, -7.0);

  const mugMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.35 });
  const mugBodyGeo = new THREE.CylinderGeometry(0.4, 0.35, 0.9, 20);
  const mugBody = new THREE.Mesh(mugBodyGeo, mugMat);
  mugBody.position.y = 0.45;
  mugGroup.add(mugBody);

  const handleGeo = new THREE.TorusGeometry(0.24, 0.06, 8, 16, Math.PI);
  const handleMesh = new THREE.Mesh(handleGeo, mugMat);
  handleMesh.position.set(0.42, 0.45, 0);
  handleMesh.rotation.z = -Math.PI / 2;
  mugGroup.add(handleMesh);

  const coffeeGeo = new THREE.CircleGeometry(0.36, 16);
  const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x180f0a, roughness: 0.1 });
  const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.86;
  mugGroup.add(coffee);

  deskProps.add(mugGroup);

  // 3. Leather Investigation Notebook & Pen
  const notebookGroup = new THREE.Group();
  notebookGroup.position.set(-8.5, -4.68, 7.2);
  notebookGroup.rotation.y = Math.PI / 6;

  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.75 });
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xf3ede0, roughness: 0.9 });
  const penMat = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.8, roughness: 0.2 });

  const coverMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 3.0), leatherMat);
  notebookGroup.add(coverMesh);

  const pageMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.06, 2.8), paperMat);
  pageMesh.position.y = 0.06;
  notebookGroup.add(pageMesh);

  const penMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12), penMat);
  penMesh.rotation.x = Math.PI / 2;
  penMesh.rotation.z = Math.PI / 8;
  penMesh.position.set(0.3, 0.14, 0);
  notebookGroup.add(penMesh);

  // 4. Vintage Rotary Telephone
  const phoneGroup = new THREE.Group();
  phoneGroup.position.set(-22, -4.7, 4.0);
  phoneGroup.rotation.y = -Math.PI / 6;

  const phoneMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.4 });
  const phoneGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });

  // Sloped body
  const phoneBaseGeo = new THREE.BoxGeometry(1.4, 0.6, 1.3);
  const phoneBase = new THREE.Mesh(phoneBaseGeo, phoneMat);
  phoneBase.position.y = 0.3;
  phoneGroup.add(phoneBase);

  // Rotary Dial
  const dialGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 18);
  const dialMesh = new THREE.Mesh(dialGeo, phoneGoldMat);
  dialMesh.rotation.x = Math.PI / 4;
  dialMesh.position.set(0, 0.55, 0.2);
  phoneGroup.add(dialMesh);

  // Cradle & Handset Receiver
  const handsetBar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 2.0), phoneMat);
  handsetBar.position.set(0, 0.8, -0.15);
  phoneGroup.add(handsetBar);

  const earpiece1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.3, 16), phoneMat);
  earpiece1.position.set(0, 0.75, 0.75);
  phoneGroup.add(earpiece1);

  const earpiece2 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.3, 16), phoneMat);
  earpiece2.position.set(0, 0.75, -1.05);
  phoneGroup.add(earpiece2);

  deskProps.add(phoneGroup);

  // 5. Reel-to-Reel Tape Recorder (Audio Heist Briefing)
  const recorderGroup = new THREE.Group();
  recorderGroup.position.set(-9.5, -4.7, -6.5);
  recorderGroup.rotation.y = Math.PI / 8;

  const recChassisMat = new THREE.MeshStandardMaterial({ color: 0x22262c, roughness: 0.4, metalness: 0.6 });
  const recReelMat = new THREE.MeshStandardMaterial({ color: 0xc8cbd0, roughness: 0.25, metalness: 0.9 });
  const recTapeMat = new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.8 });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 1.8), recChassisMat);
  chassis.position.y = 0.2;
  recorderGroup.add(chassis);

  // Left Tape Reel
  const reel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 20), recTapeMat);
  reel1.position.set(-0.55, 0.44, -0.2);
  recorderGroup.add(reel1);
  const hub1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), recReelMat);
  hub1.position.set(-0.55, 0.45, -0.2);
  recorderGroup.add(hub1);

  // Right Tape Reel
  const reel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 20), recTapeMat);
  reel2.position.set(0.55, 0.44, -0.2);
  recorderGroup.add(reel2);
  const hub2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), recReelMat);
  hub2.position.set(0.55, 0.45, -0.2);
  recorderGroup.add(hub2);

  // Glowing Green REC LED
  const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff66 }));
  recLed.position.set(0.9, 0.42, 0.6);
  recorderGroup.add(recLed);

  deskProps.add(recorderGroup);

  deskProps.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(deskProps);

  // --- HEIST CELLAR ENVIRONMENT & STORAGE PROPS ---
  const cellarProps = new THREE.Group();

  // Helper: Cardboard Archive Box with "TOP SECRET // CLASSIFIED" label
  function createArchiveBoxTexture(label) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b88a58';
    ctx.fillRect(0, 0, 512, 512);

    // Box tape
    ctx.fillStyle = '#a67746';
    ctx.fillRect(0, 230, 512, 52);

    // Printed white stencil label
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 80, 392, 120);

    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 6;
    ctx.strokeRect(66, 86, 380, 108);

    ctx.fillStyle = '#c0392b';
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TOP SECRET', 256, 125);

    ctx.fillStyle = '#222222';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(label || 'ACM HEIST ARCHIVES', 256, 165);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const boxTex1 = createArchiveBoxTexture('ACM COUNCIL 2024');
  const boxTex2 = createArchiveBoxTexture('OPERATION: HEIST');
  const boxMat1 = new THREE.MeshStandardMaterial({ map: boxTex1, roughness: 0.9 });
  const boxMat2 = new THREE.MeshStandardMaterial({ map: boxTex2, roughness: 0.9 });

  function addArchiveBox(x, y, z, rotY, mat) {
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.2, 3.6), mat || boxMat1);
    boxMesh.position.set(x, y, z);
    if (rotY) boxMesh.rotation.y = rotY;
    cellarProps.add(boxMesh);
  }

  // Stacks beside file cabinet
  addArchiveBox(-48, -13.9, 23, 0.1, boxMat1);
  addArchiveBox(-48, -11.7, 23.2, -0.15, boxMat2);
  addArchiveBox(-48, -9.5, 23.1, 0.05, boxMat1);

  // Stacks beside bookshelf
  addArchiveBox(8, -13.9, -28, -0.2, boxMat2);
  addArchiveBox(8, -11.7, -28.2, 0.1, boxMat1);

  // Helper: Tactical Wooden Supply Crate
  function createWoodenCrate(x, y, z, rotY) {
    const crateGroup = new THREE.Group();
    crateGroup.position.set(x, y, z);
    if (rotY) crateGroup.rotation.y = rotY;

    const crateMat = new THREE.MeshStandardMaterial({ color: 0x5c4028, roughness: 0.85 });
    const ironCornerMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });

    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.4, 4.2), crateMat);
    crateGroup.add(mainBody);

    // Cross braces
    const braceMat = new THREE.MeshStandardMaterial({ color: 0x48321e, roughness: 0.9 });
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(4.24, 0.5, 4.24), braceMat);
    crateGroup.add(b1);

    cellarProps.add(crateGroup);
  }

  // Corner supply crate stack
  createWoodenCrate(-48, -13.3, -28, 0.2);
  createWoodenCrate(-48, -9.9, -28, -0.1);

  // Heavy Steel Dial Safe
  const safeGroup = new THREE.Group();
  safeGroup.position.set(-50, -12.6, 17);
  safeGroup.rotation.y = Math.PI / 2;

  const safeSteelMat = new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.4, metalness: 0.8 });
  const safeGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.25, metalness: 0.9 });

  const safeBody = new THREE.Mesh(new THREE.BoxGeometry(4.0, 4.8, 3.8), safeSteelMat);
  safeGroup.add(safeBody);

  // Safe Dial & Spoke Turn Wheel
  const safeDial = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.15, 20), safeGoldMat);
  safeDial.rotation.x = Math.PI / 2;
  safeDial.position.set(0.6, 0.2, 1.95);
  safeGroup.add(safeDial);

  const safeWheelCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), safeGoldMat);
  safeWheelCenter.rotation.x = Math.PI / 2;
  safeWheelCenter.position.set(-0.6, 0.2, 1.95);
  safeGroup.add(safeWheelCenter);

  const safeSpoke = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.1), safeGoldMat);
  safeSpoke.position.set(-0.6, 0.2, 2.05);
  safeGroup.add(safeSpoke);

  cellarProps.add(safeGroup);

  // Standing Brass World Globe (Near Window)
  const globeGroup = new THREE.Group();
  globeGroup.position.set(-4, -15, -34);

  const woodTripodMat = new THREE.MeshStandardMaterial({ color: 0x3d2012, roughness: 0.7 });
  const brassMatGlobe = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });
  const globeMapMat = new THREE.MeshStandardMaterial({ color: 0x22496a, roughness: 0.6 });

  // Tripod Legs
  for (let l = 0; l < 3; l++) {
    const angle = (l * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 6.5, 8), woodTripodMat);
    leg.position.set(Math.cos(angle) * 1.2, 3.2, Math.sin(angle) * 1.2);
    leg.rotation.z = Math.cos(angle) * 0.2;
    leg.rotation.x = Math.sin(angle) * 0.2;
    globeGroup.add(leg);
  }

  // Central Brass Column & Meridian Ring
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.0, 12), brassMatGlobe);
  col.position.y = 6.2;
  globeGroup.add(col);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.08, 12, 32), brassMatGlobe);
  ring.position.y = 8.0;
  ring.rotation.y = Math.PI / 4;
  globeGroup.add(ring);

  // Globe Sphere
  const globeSphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 24, 24), globeMapMat);
  globeSphere.position.y = 8.0;
  globeSphere.rotation.z = 0.41; // 23.5 degrees Earth tilt
  globeGroup.add(globeSphere);

  cellarProps.add(globeGroup);

  // Bookshelf Trophy Cup & Blueprint Scrolls
  const trophyGroup = new THREE.Group();
  trophyGroup.position.set(5, -3.5, -40);

  const trophyBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 }));
  trophyGroup.add(trophyBase);
  const trophyStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 12), safeGoldMat);
  trophyStem.position.y = 0.6;
  trophyGroup.add(trophyStem);
  const trophyCup = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.2, 1.0, 16), safeGoldMat);
  trophyCup.position.y = 1.3;
  trophyGroup.add(trophyCup);

  cellarProps.add(trophyGroup);

  // Helper: Industrial Caged Wall Sconces
  function addWallSconce(x, y, z, rotY) {
    const sconceGroup = new THREE.Group();
    sconceGroup.position.set(x, y, z);
    if (rotY) sconceGroup.rotation.y = rotY;

    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1f1a16, roughness: 0.6, metalness: 0.8 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });

    // Mount Plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.8), ironMat);
    sconceGroup.add(plate);

    // Curved Arm & Cage
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8), ironMat);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(0.4, 0.2, 0);
    sconceGroup.add(arm);

    const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 8, 1, true), ironMat);
    cage.position.set(0.8, 0, 0);
    sconceGroup.add(cage);

    const sBulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), bulbMat);
    sBulb.position.set(0.8, 0, 0);
    sconceGroup.add(sBulb);

    const sLight = new THREE.PointLight(0xff9933, 35, 14, 2);
    sLight.position.set(0.9, 0, 0);
    sLight.castShadow = false;
    sconceGroup.add(sLight);

    cellarProps.add(sconceGroup);
  }

  // Sconces on entryway partition columns
  addWallSconce(29.8, 4, -13.5, 0);
  addWallSconce(29.8, 4, 13.5, 0);
  addWallSconce(57.5, 4, 0, -Math.PI / 2);

  // Standing Mahogany Coat Rack with Fedora & Trench Coat
  const coatRackGroup = new THREE.Group();
  coatRackGroup.position.set(20, -15, -35);

  const mahoganyMat = new THREE.MeshStandardMaterial({ color: 0x3b1e10, roughness: 0.65 });
  const brassHookMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });
  const fedoraMat = new THREE.MeshStandardMaterial({ color: 0x241e1b, roughness: 0.9 });
  const coatMat = new THREE.MeshStandardMaterial({ color: 0x302a24, roughness: 0.85 });

  // Base Claw Feet
  for (let f = 0; f < 4; f++) {
    const fAngle = (f * Math.PI * 2) / 4;
    const claw = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 2.2), mahoganyMat);
    claw.position.set(Math.cos(fAngle) * 1.1, 0.2, Math.sin(fAngle) * 1.1);
    claw.rotation.y = fAngle;
    coatRackGroup.add(claw);
  }

  // Vertical Turned Pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 14.5, 16), mahoganyMat);
  pole.position.y = 7.25;
  coatRackGroup.add(pole);

  // Brass Hooks
  for (let h = 0; h < 4; h++) {
    const hAngle = (h * Math.PI * 2) / 4 + Math.PI / 4;
    const hookArm = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 8, 16, Math.PI * 0.8), brassHookMat);
    hookArm.position.set(Math.cos(hAngle) * 0.4, 13.2, Math.sin(hAngle) * 0.4);
    hookArm.rotation.y = hAngle;
    hookArm.rotation.x = Math.PI / 6;
    coatRackGroup.add(hookArm);
  }

  // Detective Fedora Hat (resting on top hook)
  const fedoraBrim = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.08, 20), fedoraMat);
  fedoraBrim.position.set(0.3, 14.0, 0.3);
  fedoraBrim.rotation.z = -0.2;
  fedoraBrim.rotation.x = 0.15;
  coatRackGroup.add(fedoraBrim);

  const fedoraCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 0.7, 16), fedoraMat);
  fedoraCrown.position.set(0.3, 14.35, 0.3);
  fedoraCrown.rotation.z = -0.2;
  fedoraCrown.rotation.x = 0.15;
  coatRackGroup.add(fedoraCrown);

  // Hanging Detective Trench Coat
  const coatBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.4, 6.5, 16, 1, true), coatMat);
  coatBody.position.set(-0.35, 9.5, -0.35);
  coatBody.rotation.z = 0.08;
  coatRackGroup.add(coatBody);

  cellarProps.add(coatRackGroup);

  // Vintage Brass Wall Clock (with real-time ticking hands)
  const clockGroup = new THREE.Group();
  clockGroup.position.set(29.7, 8.5, 0);
  clockGroup.rotation.y = -Math.PI / 2;

  const clockBrassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });

  // Clock Bezel
  const bezel = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.3, 0.4, 32), clockBrassMat);
  bezel.rotation.x = Math.PI / 2;
  clockGroup.add(bezel);

  // Clock Face Canvas
  function createClockFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Ivory background
    ctx.fillStyle = '#f6f1e3';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#221a14';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Hour numbers
    ctx.fillStyle = '#1a1816';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const numerals = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    numerals.forEach((num, i) => {
      const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
      const nx = 256 + Math.cos(angle) * 180;
      const ny = 256 + Math.sin(angle) * 180;
      ctx.fillText(num, nx, ny);
    });

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = '#8c2424';
    ctx.fillText('ACM CHRONO', 256, 320);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const faceMesh = new THREE.Mesh(
    new THREE.CircleGeometry(2.0, 32),
    new THREE.MeshBasicMaterial({ map: createClockFaceTexture() })
  );
  faceMesh.position.z = 0.21;
  clockGroup.add(faceMesh);

  // Real-Time Clock Hands
  let hourPivot = new THREE.Group();
  let minPivot = new THREE.Group();
  let secPivot = new THREE.Group();

  const hourHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.1, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );
  hourHand.position.set(0, 0.45, 0.23);
  hourPivot.add(hourHand);
  clockGroup.add(hourPivot);

  const minHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.6, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );
  minHand.position.set(0, 0.7, 0.24);
  minPivot.add(minHand);
  clockGroup.add(minPivot);

  const secondHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.8, 0.02),
    new THREE.MeshBasicMaterial({ color: 0xcc2222 })
  );
  secondHand.position.set(0, 0.75, 0.25);
  secPivot.add(secondHand);
  clockGroup.add(secPivot);

  cellarProps.add(clockGroup);

  // Framed Heist Schematics (North Wall)
  function createSchematicTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // Blueprint deep blue
    ctx.fillStyle = '#0f2b48';
    ctx.fillRect(0, 0, 1024, 768);

    // Blueprint grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1024; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 768); ctx.stroke();
    }
    for (let y = 0; y < 768; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
    }

    // Floor plan outlines
    ctx.strokeStyle = '#8bc34a';
    ctx.lineWidth = 4;
    ctx.strokeRect(120, 120, 784, 528);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(180, 180, 320, 220); // Room A
    ctx.strokeRect(520, 180, 320, 220); // Room B
    ctx.strokeRect(180, 420, 660, 180); // Vault Chamber

    // Stencil Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('OPERATION: CODEHEIST // FACILITY SCHEMATICS', 130, 80);

    ctx.fillStyle = '#ff5252';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('[ ACCESS POINT: REAR VENTILATION ]', 200, 520);
    ctx.fillText('[ VAULT LOCATION: CENTRAL CORE ]', 200, 560);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const schematicFrame = new THREE.Mesh(
    new THREE.BoxGeometry(10.5, 8.0, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x1f1610, roughness: 0.7 })
  );
  schematicFrame.position.set(18, 5.0, -42.8);

  const schematicContent = new THREE.Mesh(
    new THREE.PlaneGeometry(9.6, 7.1),
    new THREE.MeshBasicMaterial({ map: createSchematicTexture() })
  );
  schematicContent.position.set(18, 5.0, -42.55);

  cellarProps.add(schematicFrame);
  cellarProps.add(schematicContent);

  // --- SYNTHESIZED WEB AUDIO HEIST SOUNDS ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playRotaryPhoneSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now + i * 0.04);
      gain.gain.setValueAtTime(0.15, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.025);
    }

    const bell1 = ctx.createOscillator();
    const bell2 = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell1.type = 'sine';
    bell2.type = 'sine';
    bell1.frequency.setValueAtTime(1050, now + 0.35);
    bell2.frequency.setValueAtTime(1250, now + 0.35);
    bellGain.gain.setValueAtTime(0.2, now + 0.35);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    bell1.connect(bellGain);
    bell2.connect(bellGain);
    bellGain.connect(ctx.destination);
    bell1.start(now + 0.35);
    bell2.start(now + 0.35);
    bell1.stop(now + 1.6);
    bell2.stop(now + 1.6);
  }

  function playTapeRecorderSound() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'square';
    oscClick.frequency.setValueAtTime(120, now);
    oscClick.frequency.exponentialRampToValueAtTime(40, now + 0.08);
    gainClick.gain.setValueAtTime(0.3, now);
    gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);
    oscClick.start(now);
    oscClick.stop(now + 0.1);

    // Encrypted Morse code beeps: "ACM" (.-  -.-.  --)
    const morsePattern = [
      { t: 0.18, d: 0.06 }, { t: 0.28, d: 0.18 },
      { t: 0.56, d: 0.18 }, { t: 0.78, d: 0.06 }, { t: 0.88, d: 0.18 }, { t: 1.10, d: 0.06 },
      { t: 1.26, d: 0.18 }, { t: 1.48, d: 0.18 }
    ];
    morsePattern.forEach(note => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + note.t);
      g.gain.setValueAtTime(0.12, now + note.t);
      g.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  // Click listener for interactive audio
  const propRaycaster = new THREE.Raycaster();
  const mouseCoord = new THREE.Vector2();

  window.addEventListener('click', (e) => {
    mouseCoord.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseCoord.y = -(e.clientY / window.innerHeight) * 2 + 1;
    propRaycaster.setFromCamera(mouseCoord, camera);

    const phoneHits = propRaycaster.intersectObjects(phoneGroup.children, true);
    if (phoneHits.length > 0) {
      playRotaryPhoneSound();
      return;
    }

    const recHits = propRaycaster.intersectObjects(recorderGroup.children, true);
    if (recHits.length > 0) {
      playTapeRecorderSound();
      return;
    }
  });

  cellarProps.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(cellarProps);

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

  const instructionsEl = document.getElementById('instructions');
  const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.matchMedia('(pointer: coarse)').matches;
  if (instructionsEl && isTouchDevice) {
    instructionsEl.textContent = 'Use Joystick to Walk | Drag to Look Around | Walk to investigate';
  }

  // --- 360 ANALOG JOYSTICK LOGIC (Mobile Touch Only) ---
  let joyDeltaX = 0;
  let joyDeltaY = 0;
  const joyZone = document.getElementById('joystick-zone');
  const joyStick = document.getElementById('joystick-stick');
  const joyMax = 35; // How far the stick can move visually
  
  function handleJoy(e) {
    e.preventDefault();
    if (!e.touches || e.touches.length === 0) return;
    
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    
    const rect = joyZone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    
    const distance = Math.hypot(dx, dy);
    if (distance > joyMax) {
      dx = dx * (joyMax / distance);
      dy = dy * (joyMax / distance);
    }
    
    joyStick.style.transform = `translate(${dx}px, ${dy}px)`;
    joyDeltaX = dx / joyMax;
    joyDeltaY = dy / joyMax;
  }
  
  function resetJoy() {
    if (joyStick) joyStick.style.transform = `translate(0px, 0px)`;
    joyDeltaX = 0;
    joyDeltaY = 0;
  }

  if (joyZone) {
    joyZone.addEventListener('touchstart', handleJoy, { passive: false });
    joyZone.addEventListener('touchmove', handleJoy, { passive: false });
    joyZone.addEventListener('touchend', resetJoy);
    joyZone.addEventListener('touchcancel', resetJoy);
  }

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
    camera.position.set(-1.5, 0, 0); 
    const forward = new THREE.Vector3(-1, 0, 0);
    controls.target.copy(camera.position).addScaledVector(forward, 0.1);
    controls.update();
    controls.enabled = true;
    setTimeout(() => { cutsceneTableTriggered = false; }, 2000);
  });

  document.getElementById('cutscene-board').addEventListener('click', function() {
    this.classList.remove('active');
    camera.position.set(-5, 0, 24); 
    const forward = new THREE.Vector3(0, 0, 1);
    controls.target.copy(camera.position).addScaledVector(forward, 0.1);
    controls.update();
    controls.enabled = true;
    setTimeout(() => { cutsceneBoardTriggered = false; }, 2000);
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

  const tableFocusTarget = new THREE.Vector3(-15, -4.75, 0);
  const southBoardTarget = new THREE.Vector3(-15, 5.0, 42.5);

  let tableCutsceneShown = false;
  let tableCutsceneHidden = false;
  let boardCutsceneShown = false;

  function animate() {
    requestAnimationFrame(animate);
    
    // --- CINEMATIC AUTO MOVEMENT SEQUENCE ---
    if (isIntroPlaying && introStartTime > 0) {
      const elapsed = (performance.now() - introStartTime) / 1000; 
      const blink = document.getElementById('blink-overlay');
      const smoothStep = (t) => {
        const c = Math.max(0, Math.min(1, t));
        return c * c * (3 - 2 * c);
      };

      // 1. WAKE UP SEQUENCE (0.0s - 11.0s)
      if (elapsed < 2.0) {
        // Crack eyes open
        let t = elapsed / 2.0;
        if (blink) blink.style.opacity = 1 - (t * 0.7);
        controls.target.set(45, -12, 39.9);
      } else if (elapsed < 2.6) {
        // Heavy blink
        if (blink) blink.style.opacity = 1.0;
        controls.target.set(45, -12, 39.9);
      } else if (elapsed < 4.5) {
        // Open eyes fully
        let t = (elapsed - 2.6) / 1.9;
        if (blink) blink.style.opacity = 1 - t;
        controls.target.set(45, -12, 39.9);
      } else if (elapsed < 6.5) {
        // Look groggily left
        let t = smoothStep((elapsed - 4.5) / 2.0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), t * 0.9);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 8.5) {
        // Look groggily right
        let t = smoothStep((elapsed - 6.5) / 2.0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.9 - (t * 1.8));
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 9.5) {
        // Look back center
        let t = smoothStep((elapsed - 8.5) / 1.0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.9 + (t * 0.9));
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 11.0) {
        // Stand up from floor
        let t = smoothStep((elapsed - 9.5) / 1.5);
        camera.position.set(45, -12 + (t * 12), 40);
        let forward = new THREE.Vector3(0, 0, -1);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
        if (blink) blink.style.display = 'none';
      }

      // 2. MOVE FORWARD STRAIGHT 12 STEPS (11.0s - 16.5s)
      else if (elapsed < 16.5) {
        let t = smoothStep((elapsed - 11.0) / 5.5);
        let curZ = 40 - (t * 40); // 40 -> 0 (Doorway opening)
        let walkBob = Math.sin((elapsed - 11.0) * 8.5) * 0.16;
        camera.position.set(45, walkBob, curZ);
        let forward = new THREE.Vector3(0, 0, -1);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      }

      // 3. TURN LEFT, WALK AHEAD 5 STEPS INSIDE ROOM, WAIT 1 SECOND (16.5s - 21.0s)
      else if (elapsed < 17.5) {
        // Turn left to face doorway (-1, 0, 0)
        let t = smoothStep((elapsed - 16.5) / 1.0);
        let angle = t * (Math.PI / 2);
        camera.position.set(45, 0, 0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 20.0) {
        // Walk forward 5 steps inside the room (45 -> 28)
        let t = smoothStep((elapsed - 17.5) / 2.5);
        let curX = 45 - (t * 17); // 45 down to 28
        let walkBob = Math.sin((elapsed - 17.5) * 8.5) * 0.16;
        camera.position.set(curX, walkBob, 0);
        let forward = new THREE.Vector3(-1, 0, 0);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 21.0) {
        // Wait 1 second facing straight into the room
        camera.position.set(28, 0, 0);
        let forward = new THREE.Vector3(-1, 0, 0);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      }

      // 4. LOOK IN THE LEFT AND RIGHT, THEN STRAIGHT (21.0s - 24.5s)
      else if (elapsed < 22.2) {
        // Look left
        let t = smoothStep((elapsed - 21.0) / 1.2);
        let angle = (Math.PI / 2) + (t * 0.65);
        camera.position.set(28, 0, 0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 23.5) {
        // Sweep head right
        let t = smoothStep((elapsed - 22.2) / 1.3);
        let angle = (Math.PI / 2) + 0.65 - (t * 1.30);
        camera.position.set(28, 0, 0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 24.5) {
        // Look straight towards the table
        let t = smoothStep((elapsed - 23.5) / 1.0);
        let angle = (Math.PI / 2) - 0.65 + (t * 0.65);
        camera.position.set(28, 0, 0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      }

      // 5. WALK STRAIGHT TOWARDS TABLE (24.5s - 28.5s)
      else if (elapsed < 28.5) {
        let t = smoothStep((elapsed - 24.5) / 4.0);
        let curX = 28 - (t * 29.5); // 28 down to -1.5 (1 more step closer, right at table edge)
        let walkBob = Math.sin((elapsed - 24.5) * 8.5) * 0.16;
        camera.position.set(curX, walkBob, 0);

        // Walk looking straight ahead at eye level
        let forward = new THREE.Vector3(-1, 0, 0);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      }

      // 5B. REACH TABLE & WAIT 0.5s LOOKING STRAIGHT (28.5s - 29.0s)
      else if (elapsed < 29.0) {
        camera.position.set(-1.5, 0, 0);
        let forward = new THREE.Vector3(-1, 0, 0);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      }

      // 5C. LOOK DOWN SLOWLY AT TABLE STANDING IN ONE PLACE & TRANSITION (29.0s - 30.5s)
      else if (elapsed < 30.5) {
        camera.position.set(-1.5, 0, 0); // Strict fixed position - no sliding into table center
        let t = smoothStep((elapsed - 29.0) / 1.5);
        let straightTarget = new THREE.Vector3(-10.5, 0, 0);
        let targetLook = new THREE.Vector3().lerpVectors(straightTarget, tableFocusTarget, t);
        const lookDir = new THREE.Vector3().subVectors(targetLook, camera.position).normalize();
        controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);

        // As we slowly look down, trigger table cutscene
        if (elapsed >= 30.0 && !tableCutsceneShown) {
          tableCutsceneShown = true;
          document.getElementById('cutscene-table').classList.add('active');
          setTimeout(() => {
            document.getElementById('newspaper-overlay').classList.add('thrown');
          }, 200);
        }
      }

      // 6. TABLE CUTSCENE FOR 3 SECONDS & RAISE GAZE (30.5s - 34.5s)
      else if (elapsed < 33.5) {
        camera.position.set(-1.5, 0, 0);
        const lookDir = new THREE.Vector3().subVectors(tableFocusTarget, camera.position).normalize();
        controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
        if (!tableCutsceneShown) {
          tableCutsceneShown = true;
          document.getElementById('cutscene-table').classList.add('active');
          setTimeout(() => {
            document.getElementById('newspaper-overlay').classList.add('thrown');
          }, 200);
        }
      } else if (elapsed < 34.5) {
        // Transition back to normal view and raise gaze back to eye level
        if (!tableCutsceneHidden) {
          tableCutsceneHidden = true;
          document.getElementById('newspaper-overlay').classList.remove('thrown');
          document.getElementById('cutscene-table').classList.remove('active');
        }
        camera.position.set(-1.5, 0, 0);
        let t = smoothStep((elapsed - 33.5) / 1.0);
        let straightTarget = new THREE.Vector3(-10.5, 0, 0);
        let targetLook = new THREE.Vector3().lerpVectors(tableFocusTarget, straightTarget, t);
        const lookDir = new THREE.Vector3().subVectors(targetLook, camera.position).normalize();
        controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
      }

      // 7. STEP 7: TURN SOUTH & WALK CLOSER TO BOARD WITH EYES LOCKED ON BOARD (34.5s - 40.5s)
      else if (elapsed < 35.5) {
        // 7A: Turn left 90 deg standing in place at table (facing south along +z towards board)
        let t = smoothStep((elapsed - 34.5) / 1.0);
        let angle = (Math.PI / 2) + (t * (Math.PI / 2));
        camera.position.set(-1.5, 0, 0);
        let forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        controls.target.copy(camera.position).addScaledVector(forward, 0.1);
      } else if (elapsed < 39.5) {
        // 7B: Walk closer to the board (z: 0 -> 24, x: -1.5 -> -5) with eyes strictly locked on the board
        let t = smoothStep((elapsed - 35.5) / 4.0);
        let curX = -1.5 - (t * 3.5);
        let curZ = t * 24;
        let walkBob = Math.sin((elapsed - 35.5) * 8.5) * 0.16;
        camera.position.set(curX, walkBob, curZ);

        const southBoardTarget = new THREE.Vector3(-15, 5.0, 42.5);
        const lookDir = new THREE.Vector3().subVectors(southBoardTarget, camera.position).normalize();
        controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
      } else if (elapsed < 40.5) {
        // 7C: Pause 1s standing close at (-5, 0, 24) with eyes locked on the board
        camera.position.set(-5, 0, 24);
        const southBoardTarget = new THREE.Vector3(-15, 5.0, 42.5);
        const lookDir = new THREE.Vector3().subVectors(southBoardTarget, camera.position).normalize();
        controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
      }

      // 8. DIRECT TRANSITION TO THE BOARD CUTSCENE (40.5s+)
      else {
        camera.position.set(-5, 0, 24);
        const southBoardTarget = new THREE.Vector3(-15, 5.0, 42.5);
        const lookDir = new THREE.Vector3().subVectors(southBoardTarget, camera.position).normalize();
        controls.target.copy(camera.position).addScaledVector(lookDir, 0.1);
        if (blink) {
          blink.style.display = 'none';
          blink.style.opacity = '0';
        }
        if (!boardCutsceneShown) {
          boardCutsceneShown = true;
          document.getElementById('cutscene-board').classList.add('active');
          cutsceneBoardTriggered = true;
          cutsceneTableTriggered = true;
          setTimeout(() => {
            cutsceneBoardTriggered = false;
            cutsceneTableTriggered = false;
          }, 2000);
        }
        isIntroPlaying = false;
        controls.enabled = true;
      }
    }

    const speed = 0.15; // Realistic walking pace
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

      // Normalize diagonal input to keep walking speed uniform
      const inputLen = Math.hypot(inputX, inputY);
      if (inputLen > 1) {
        inputX /= inputLen;
        inputY /= inputLen;
      }

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

    // Update Real-Time Wall Clock Hands
    if (typeof secPivot !== 'undefined' && typeof minPivot !== 'undefined' && typeof hourPivot !== 'undefined') {
      const nowClock = new Date();
      const s = nowClock.getSeconds() + nowClock.getMilliseconds() / 1000;
      const m = nowClock.getMinutes() + s / 60;
      const h = (nowClock.getHours() % 12) + m / 60;
      secPivot.rotation.z = -s * (Math.PI * 2 / 60);
      minPivot.rotation.z = -m * (Math.PI * 2 / 60);
      hourPivot.rotation.z = -h * (Math.PI * 2 / 12);
    }

    controls.update();
    renderer.render(scene, camera);
  }

  // Hover pointer cursor over interactive objects
  window.addEventListener('mousemove', (e) => {
    if (typeof phoneGroup === 'undefined' || typeof recorderGroup === 'undefined') return;
    mouseCoord.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseCoord.y = -(e.clientY / window.innerHeight) * 2 + 1;
    propRaycaster.setFromCamera(mouseCoord, camera);

    const hits = propRaycaster.intersectObjects([...phoneGroup.children, ...recorderGroup.children], true);
    document.body.style.cursor = hits.length > 0 ? 'pointer' : 'default';
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
