# personal-website

An interactive Arch-terminal site. Type commands (`help`, `who`, `stuff`, `ls`,
`cat experience.txt`, `msg ...`) to read about me.

`index.html`, `style.css`, `terminal.js`, `theme.js`. No build step, no dependencies.
Served by GitHub Pages at haileycheng.com.

Content lives as markup in `#docs`, so the site still reads fine with JavaScript off.

Preview locally:

```bash
python3 -m http.server 8000
```
