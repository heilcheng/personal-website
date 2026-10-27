Vendored from https://github.com/stackedlol/ascii-sharks (MIT, see LICENSE).
`src/renderer.ts` is patched to a pale pond with gray and gray-blue sharks and fish; clicking drops food that fish and sharks converge on. Rebuild `../sharks.js` with:

    npx esbuild@0.24.0 main.ts --bundle --minify --format=iife --target=es2019 --outfile=../sharks.js
