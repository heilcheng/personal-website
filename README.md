# personal-website

An interactive terminal, drawn as a GNOME Terminal window on the Arch/GNOME purple
wallpaper. Type commands (`help`, `who`, `stuff`, `ls`, `cat experience.txt`, `msg ...`)
to read about me.

`index.html`, `style.css`, `terminal.js`, `theme.js`, `wallpaper.svg`. No build step.
Served by GitHub Pages at haileycheng.com.

Content lives as markup in `#docs`, so the page still reads fine with JavaScript off.

Preview locally:

```bash
python3 -m http.server 8000
```
