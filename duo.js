/* Duo, drawn as a pixel sprite. Two block characters per pixel so the cells
   come out roughly square in a monospace cell. */
(function (global) {
  var PALETTE = {
    g: "#58cc02",
    l: "#89e219",
    d: "#46a302",
    w: "#ffffff",
    k: "#2b2b2b",
    y: "#ffc800",
    o: "#ff9600"
  };

  var ART = [
    "....gg..........gg....",
    "...gggg........gggg...",
    "..gggggggggggggggggg..",
    ".gggggggglllllgggggggg",
    ".ggggggglllllllggggggg",
    "gggwwwwwggggggwwwwwggg",
    "gggwwkkwggggggwkkwwggg",
    "gggwwkkwgyyyygwkkwwggg",
    "gggwwwwwgoooogwwwwwggg",
    ".ggggggggoooogggggggg.",
    "..gggggggggggggggggg..",
    ".gggggggggggggggggggg.",
    "gggggggggggggggggggggg",
    "ggggggllggggggggllgggg",
    "gggggglllgggggglllgggg",
    "ggggggggglllllgggggggg",
    "gggggggggglllggggggggg",
    "gggggggggggggggggggggg",
    "..gggggggggggggggggg..",
    "...gggg........gggg...",
    "...oooo........oooo..."
  ];

  // Group runs of one colour into a single span rather than one per pixel.
  function render() {
    var out = "";
    for (var r = 0; r < ART.length; r++) {
      var row = ART[r];
      var i = 0;
      while (i < row.length) {
        var ch = row[i];
        var run = 0;
        while (i + run < row.length && row[i + run] === ch) run++;
        var cells = new Array(run + 1).join("██");
        if (ch === "." || !PALETTE[ch]) {
          out += new Array(run + 1).join("  ");
        } else {
          out += '<span style="color:' + PALETTE[ch] + '">' + cells + "</span>";
        }
        i += run;
      }
      if (r < ART.length - 1) out += "\n";
    }
    return out;
  }

  global.DUO = { render: render };
})(window);
