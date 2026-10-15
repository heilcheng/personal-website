// Living backdrop: a field of soft gray dots that swell in slow, overlapping
// waves and lift gently around the pointer. Static frame if motion is reduced.
(function () {
  var canvas = document.getElementById("bg");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var GAP = 26;
  var w = 0, h = 0, dpr = 1, cols = 0, rows = 0;
  var px = -9999, py = -9999, tx = -9999, ty = -9999;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / GAP) + 1;
    rows = Math.ceil(h / GAP) + 1;
    if (still) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    var s = t * 0.00022;
    var ox = (w - (cols - 1) * GAP) / 2;
    var oy = (h - (rows - 1) * GAP) / 2;
    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < cols; i++) {
        var x = ox + i * GAP, y = oy + j * GAP;
        // Two crossing travelling waves plus a slow radial breath from the centre.
        var u = x / w, v = y / h;
        var a = Math.sin(u * 5.2 + s * 3.1) * Math.cos(v * 4.1 - s * 2.3);
        var b = Math.sin((u + v) * 6.5 - s * 1.7);
        var d = Math.hypot(u - 0.5, (v - 0.5) * h / w);
        var c = Math.sin(d * 14 - s * 4);
        var n = (a * 0.5 + b * 0.3 + c * 0.2 + 1) / 2; // 0..1
        n = Math.pow(n, 1.8);
        var dx = x - px, dy = y - py;
        var near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 170);
        n = Math.min(1, n + near * near * 0.7);
        var r = 0.9 + n * 4.2;
        var g = Math.round(200 - n * 130);
        ctx.fillStyle = "rgba(" + g + "," + g + "," + (g + 4) + "," + (0.45 + n * 0.5) + ")";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  function loop(t) {
    if (!document.hidden) draw(t);
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; });
  document.addEventListener("pointerleave", function () { tx = ty = -9999; });

  resize();
  if (!still) requestAnimationFrame(loop);
})();
