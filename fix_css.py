with open('style.css', 'r', encoding='utf-16' if open('style.css', 'rb').read(2) == b'\xff\xfe' else 'utf-8') as f:
    style_content = f.read()

# In PowerShell `cat` output might have just been utf-16, wait! 
# Let's just read it as utf-8 or whatever it is, wait, style.css was pulled from git, so it's utf-8!
with open('style.css', 'r', encoding='utf-8') as f:
    style_content = f.read()

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write("@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n")
    f.write(style_content)
