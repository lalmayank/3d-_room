with open('main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

imports = []
code = []

for line in lines:
    if line.startswith('import '):
        imports.append(line)
    else:
        code.append(line)

code_str = "".join(code)

# Replace document.body.appendChild with mountElement.appendChild
code_str = code_str.replace("document.body.appendChild(renderer.domElement);", "mountElement.appendChild(renderer.domElement);")

# Intercept requestAnimationFrame
code_str = code_str.replace("requestAnimationFrame(animate);", "reqId = requestAnimationFrame(animate);")
code_str = "let reqId = null;\n" + code_str

# Create the wrapper
wrapped = "".join(imports) + "\nexport function initThreeJS(mountElement) {\n"
wrapped += "\n".join("  " + line for line in code_str.split("\n"))
wrapped += """
  return () => {
    cancelAnimationFrame(reqId);
    if (mountElement && mountElement.contains(renderer.domElement)) {
       mountElement.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };
}
"""

with open('src/main_logic.js', 'w', encoding='utf-8') as f:
    f.write(wrapped)

print("Created main_logic.js")
