// Background for haileycheng.com: the ascii-sharks engine (MIT, see LICENSE)
// with a light monochrome palette, drawn on the fixed #ocean canvas.
import { OceanEngine } from "./src";

const canvas = document.getElementById("ocean") as HTMLCanvasElement | null;
if (canvas) new OceanEngine(canvas);
