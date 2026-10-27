// Background for haileycheng.com: the ascii-sharks engine (MIT, see LICENSE)
// with a light, low-saturation palette, drawn on the fixed #ocean canvas.
// Click open water to drop food; window.feedFish() lets the terminal do it too.
import { OceanEngine } from "./src";

declare global {
  interface Window {
    feedFish?: () => boolean;
  }
}

const canvas = document.getElementById("ocean") as HTMLCanvasElement | null;
if (canvas) {
  const engine = new OceanEngine(canvas);
  window.feedFish = () => {
    engine.feedAround(3);
    return true;
  };
}
