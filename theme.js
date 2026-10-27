(function () {
  var root = document.documentElement;

  // The stylesheet renders light unless data-theme="dark" is set.
  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  window.toggleTheme = function () {
    var next = current() === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    return next;
  };
})();
