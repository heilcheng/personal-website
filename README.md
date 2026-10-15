# personal-website

An interactive terminal, drawn as a macOS-style window on a white page with a slow
gray mist behind it. Black, white and Apple's system grays only. Type commands (`help`, `who`, `stuff`, `ls`, `cat experience.txt`, `msg ...`)
to read about me.

`index.html`, `style.css`, `terminal.js`, `theme.js`. No build step.
Served by GitHub Pages at haileycheng.com.

Content lives as markup in `#docs`, so the page still reads fine with JavaScript off.

Preview locally:

```bash
python3 -m http.server 8000
```
