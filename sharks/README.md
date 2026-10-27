Vendored from https://github.com/stackedlol/ascii-sharks (MIT, see LICENSE).
`src/renderer.ts` is patched to a white background with tinted, colour-flecked sharks and colour-coded fish species. Rebuild `../sharks.js` with:

    npx esbuild@0.24.0 main.ts --bundle --minify --format=iife --target=es2019 --outfile=../sharks.js
