(function () {
  var root = document.documentElement;

  // The stylesheet renders dark unless data-theme="light" is set.
  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  window.toggleTheme = function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    return next;
  };
})();
