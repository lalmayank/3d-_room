import re

with open('src/main_logic.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'^\s*import\s+.*?;', '', content, flags=re.MULTILINE)

with open('src/main_logic.js', 'w', encoding='utf-8') as f:
    f.write("import * as THREE from 'three';\nimport { OrbitControls } from 'three/addons/controls/OrbitControls.js';\nimport { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\n" + content)
