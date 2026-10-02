import re

def html_to_jsx(html):
    # Replace class= with className=
    jsx = re.sub(r'class=', 'className=', html)
    
    # Replace style="..." with style={{...}}
    def style_replacer(match):
        style_str = match.group(1)
        # simplistic conversion
        props = []
        for prop in style_str.split(';'):
            prop = prop.strip()
            if not prop: continue
            if ':' not in prop: continue
            k, v = prop.split(':', 1)
            k = k.strip()
            v = v.strip()
            # camelCase key
            parts = k.split('-')
            k_camel = parts[0] + ''.join(x.capitalize() for x in parts[1:])
            # Handle background-image urls
            if 'url(' in v:
                props.append(f"{k_camel}: `{v}`")
            else:
                props.append(f"{k_camel}: '{v}'")
        
        style_obj = ", ".join(props)
        return f"style={{{{{style_obj}}}}}"

    jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)
    
    # Self-closing tags
    jsx = re.sub(r'<img([^>]*[^/])>', r'<img\1 />', jsx)
    jsx = re.sub(r'<source([^>]*[^/])>', r'<source\1 />', jsx)
    
    # camelCase React attributes
    jsx = re.sub(r' autoplay ', ' autoPlay ', jsx)
    jsx = re.sub(r' playsinline ', ' playsInline ', jsx)
    jsx = re.sub(r' webkit-playsinline ', ' webkit-playsinline="true" ', jsx) # not standard React, but whatever
    jsx = re.sub(r'crossOrigin="anonymous"', 'crossOrigin="anonymous"', jsx) # ok
    
    return jsx

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

body_match = re.search(r'<body>(.*?)<script type="module"', content, re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    jsx_content = html_to_jsx(body_content)
    
    with open('src/UI.jsx', 'w', encoding='utf-8') as f:
        f.write("import React from 'react';\n\n")
        f.write("export default function UI() {\n")
        f.write("  return (\n    <>\n")
        f.write(jsx_content)
        f.write("    </>\n  );\n}\n")
    print("UI.jsx created.")
