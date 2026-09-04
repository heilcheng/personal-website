(function () {
  var screenEl = document.getElementById("screen");
  var input = document.getElementById("cmdline");
  var docs = document.getElementById("docs");
  var term = document.getElementById("term");
  if (!screenEl || !input || !docs) return;

  var PROMPT = "[hailey@haileycheng.com ~]$";
  var history = [];
  var histIndex = 0;
  var booted = Date.now();

  var FILES = {
    "about.txt": "about",
    "experience.txt": "experience",
    "education.txt": "education",
    "interests.txt": "interests",
    "contact.txt": "contact"
  };

  function section(name) {
    var el = docs.querySelector('[data-cmd="' + name + '"]');
    return el ? el.innerHTML : null;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function write(html, cls) {
    var block = document.createElement("div");
    block.className = "out" + (cls ? " " + cls : "");
    block.innerHTML = html;
    screenEl.appendChild(block);
    return block;
  }

  function writeCommand(raw) {
    var line = document.createElement("p");
    line.className = "cmd";
    line.innerHTML = '<span class="prompt">' + PROMPT + "</span> " + esc(raw);
    screenEl.appendChild(line);
  }

  function scrollDown() {
    term.scrollTop = term.scrollHeight;
  }

  var COMMANDS = {
    help: function () {
      return (
        '<div class="row"><span class="k">who</span>        who am i, in one breath</div>' +
        '<div class="row"><span class="k">experience</span> where i have worked</div>' +
        '<div class="row"><span class="k">education</span>  where i have studied</div>' +
        '<div class="row"><span class="k">stuff</span>      medals, records, and one very large dragon</div>' +
        '<div class="row"><span class="k">interests</span>  what i think about unprompted</div>' +
        '<div class="row"><span class="k">contact</span>    how to reach me</div>' +
        '<div class="row"><span class="k">msg</span> &lt;text&gt; say something to me directly</div>' +
        '<div class="row"><span class="k">ls</span>         list what is on this machine</div>' +
        '<div class="row"><span class="k">cat</span> &lt;file&gt; read one of them</div>' +
        '<div class="row"><span class="k">screenfetch</span> redraw the banner</div>' +
        '<div class="row"><span class="k">theme</span>      flip the lights</div>' +
        '<div class="row"><span class="k">clear</span>      wipe the screen</div>' +
        '<div class="sub">arrow keys walk your history. tab completes. there are a few commands ' +
        "i did not list -- poke around.</div>"
      );
    },

    who: function () { return section("about"); },
    whoami: function () { return '<div class="row">a guest, and welcome here.</div>'; },
    about: function () { return section("about"); },
    experience: function () { return section("experience"); },
    work: function () { return section("experience"); },
    education: function () { return section("education"); },
    edu: function () { return section("education"); },
    stuff: function () { return section("stuff"); },
    awards: function () { return section("stuff"); },
    interests: function () { return section("interests"); },
    contact: function () { return section("contact"); },
    screenfetch: function () { return section("screenfetch"); },
    neofetch: function () { return section("screenfetch"); },
    fetch: function () { return section("screenfetch"); },

    ls: function () {
      return (
        '<div class="row cols">' +
        '<span class="b">about.txt</span><span class="b">experience.txt</span>' +
        '<span class="b">education.txt</span><span class="b">interests.txt</span>' +
        '<span class="b">contact.txt</span><span class="dir">stuff/</span>' +
        "</div>"
      );
    },

    cat: function (args) {
      var name = (args[0] || "").toLowerCase();
      if (!name) return '<div class="row err">cat: missing operand</div>';
      if (name === "stuff/" || name === "stuff") return section("stuff");
      if (FILES[name]) return section(FILES[name]);
      var bare = name.replace(/\.txt$/, "");
      if (FILES[bare + ".txt"]) return section(FILES[bare + ".txt"]);
      return '<div class="row err">cat: ' + esc(name) + ": No such file or directory</div>";
    },

    echo: function (args, raw) {
      return '<div class="row">' + esc(raw.replace(/^echo\s*/i, "")) + "</div>";
    },

    msg: function (args, raw) {
      var body = raw.replace(/^msg\s*/i, "").trim();
      if (!body) {
        return (
          '<div class="row">usage: <span class="b">msg</span> &lt;your message&gt;</div>' +
          '<div class="sub">e.g. msg i also think the dragon was structurally unnecessary</div>'
        );
      }
      var href =
        "mailto:haileycheng@proton.me?subject=" +
        encodeURIComponent("hello from haileycheng.com") +
        "&body=" +
        encodeURIComponent(body);
      return (
        '<div class="row">queued: "' + esc(body) + '"</div>' +
        '<div class="row">this terminal has no backend, so nothing sends itself. ' +
        '<a href="' + href + '">open it in your mail client</a> and it is on its way.</div>'
      );
    },

    theme: function () {
      var now = window.toggleTheme ? window.toggleTheme() : "dark";
      return '<div class="row">theme: ' + now + "</div>";
    },

    clear: function () {
      screenEl.innerHTML = "";
      return null;
    },

    history: function () {
      if (!history.length) return '<div class="row dim">nothing yet.</div>';
      return history
        .map(function (h, i) {
          return '<div class="row"><span class="dim">' + (i + 1) + "</span>  " + esc(h) + "</div>";
        })
        .join("");
    },

    pwd: function () { return '<div class="row">/home/hailey</div>'; },
    date: function () { return '<div class="row">' + new Date().toString() + "</div>"; },
    uname: function () { return '<div class="row">Linux haileycheng.com 6.1.1-arch1-1 x86_64 GNU/Linux</div>'; },

    uptime: function () {
      var mins = Math.max(1, Math.round((Date.now() - booted) / 60000));
      return '<div class="row">up ' + mins + " min, 1 user, load average: hopeful</div>";
    },

    sudo: function (args) {
      var what = args.join(" ");
      if (!what) return '<div class="row err">usage: sudo &lt;command&gt;</div>';
      return '<div class="row err">hailey is not in the sudoers file. this incident has been reported.</div>';
    },

    chess: function () {
      return (
        '<div class="row">2000 elo on chess.com. mostly the london, regrettably.</div>' +
        '<div class="sub">i will take a game: <a href="https://www.chess.com">chess.com</a></div>'
      );
    },

    dragon: function () {
      return (
        '<div class="row">42 metres. 38,000 balloons. one Guinness World Record.</div>' +
        '<div class="sub">ushering in the Year of the Dragon, and never doing that again.</div>'
      );
    },

    stars: function () {
      return (
        '<div class="row"><a href="https://github.com/heilcheng/awesome-agent-skills">' +
        'awesome-agent-skills</a> <span class="star" data-stars="heilcheng/awesome-agent-skills">' +
        "&#9733; ...</span></div>"
      );
    },

    corgi: function () {
      return (
        '<pre class="art">   /\\_/\\  ___\n  = o_o =_______\n   __^      __(  \\.__)\n' +
        "(@)&lt;_____&gt;__(_____)__</pre>" +
        '<div class="sub">coglix runs on corgi time.</div>'
      );
    },

    coglix: function () {
      return (
        '<div class="row">Coglix Labs — ai-personalized neuro-recovery.</div>' +
        '<div class="sub">helping people move, speak, and reclaim their lives. ' +
        '<a href="https://coglixlabs.com">coglixlabs.com</a></div>'
      );
    },

    exit: function () {
      return '<div class="row dim">there is no exit. there is only haileycheng.com.</div>';
    }
  };


  var NAMES = Object.keys(COMMANDS).concat(Object.keys(FILES));

  function run(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;

    writeCommand(raw);
    history.push(trimmed);
    histIndex = history.length;

    var parts = trimmed.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);

    var fn = COMMANDS[name];
    if (!fn) {
      write(
        '<div class="row err">' + esc(name) + ": command not found</div>" +
          '<div class="sub">try <span class="b">help</span></div>'
      );
      return;
    }

    var out = fn(args, trimmed);
    if (out) {
      var block = write(out);
      if (block.querySelector("[data-stars]")) refreshStars();
    }
  }

  function commonPrefix(list) {
    if (!list.length) return "";
    var prefix = list[0];
    for (var i = 1; i < list.length; i++) {
      var j = 0;
      while (j < prefix.length && j < list[i].length && prefix[j] === list[i][j]) j++;
      prefix = prefix.slice(0, j);
      if (!prefix) break;
    }
    return prefix;
  }

  function complete() {
    var value = input.value;
    var parts = value.split(/\s+/);
    var last = parts[parts.length - 1].toLowerCase();
    if (!last) return;

    var hits = NAMES.filter(function (n) {
      return n.indexOf(last) === 0;
    });
    if (!hits.length) return;

    // Extend to the longest prefix every candidate shares, like bash does.
    var prefix = commonPrefix(hits);
    if (prefix.length > last.length) {
      parts[parts.length - 1] = prefix;
      input.value = parts.join(" ");
      if (hits.length === 1) return;
      return;
    }

    if (hits.length > 1) {
      writeCommand(value);
      write(
        '<div class="row cols">' +
          hits
            .map(function (h) {
              return "<span>" + h + "</span>";
            })
            .join("") +
          "</div>"
      );
      scrollDown();
    }
  }

  var typed = document.getElementById("typed");
  var typedAfter = document.getElementById("typed-after");
  var cursor = document.getElementById("cursor");
  var inputLine = document.getElementById("input-line");

  function renderInput() {
    var v = input.value;
    var pos = input.selectionStart == null ? v.length : input.selectionStart;
    typed.textContent = v.slice(0, pos);
    var under = v.charAt(pos);
    cursor.textContent = under || "\u00a0";
    typedAfter.textContent = v.slice(pos + 1);
  }

  ["input", "keyup", "click", "select"].forEach(function (ev) {
    input.addEventListener(ev, renderInput);
  });
  input.addEventListener("focus", function () {
    inputLine.classList.add("focused");
    renderInput();
  });
  input.addEventListener("blur", function () {
    inputLine.classList.remove("focused");
  });

  // Header-bar menu (GNOME-style popover).
  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("menu");
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-action]");
      if (!btn) return;
      e.stopPropagation();
      closeMenu();
      var action = btn.getAttribute("data-action");
      if (action === "theme") run("theme");
      else if (action === "clear") run("clear");
      else if (action === "help") run("help");
      scrollDown();
      input.focus();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var value = input.value;
      input.value = "";
      run(value);
      scrollDown();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIndex > 0) {
        histIndex--;
        input.value = history[histIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex < history.length - 1) {
        histIndex++;
        input.value = history[histIndex] || "";
      } else {
        histIndex = history.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      screenEl.innerHTML = "";
    }
    // Keys that change the value synchronously (history, tab) need a repaint;
    // ordinary typing repaints via the input event.
    setTimeout(renderInput, 0);
  });

  // Clicking anywhere in the terminal focuses the prompt, unless the user is
  // selecting text or following a link.
  document.addEventListener("click", function (e) {
    closeMenu();
    if (e.target && e.target.closest && e.target.closest("a, button, #headerbar")) return;
    if (String(window.getSelection())) return;
    input.focus();
  });

  // Live star count, cached for an hour so a reload does not re-hit the API.
  function refreshStars() {
    var nodes = [].slice.call(document.querySelectorAll("[data-stars]"));
    if (!nodes.length) return;
    var repo = nodes[0].getAttribute("data-stars");
    var key = "stars:" + repo;

    function paint(count) {
      var label = "\u2605 " + Number(count).toLocaleString("en-US");
      [].slice.call(document.querySelectorAll('[data-stars="' + repo + '"]'))
        .forEach(function (n) { n.textContent = label; });
    }

    try {
      var cached = JSON.parse(localStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.at < 3600000) {
        paint(cached.n);
        return;
      }
    } catch (e) {}

    fetch("https://api.github.com/repos/" + repo)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || typeof data.stargazers_count !== "number") return;
        paint(data.stargazers_count);
        try {
          localStorage.setItem(key, JSON.stringify({ n: data.stargazers_count, at: Date.now() }));
        } catch (e) {}
      })
      .catch(function () { /* keep whatever number is already on the page */ });
  }

  // Boot.
  writeCommand("screenfetch");
  write(section("screenfetch"));
  write(
    '<div class="row hint">this is a real terminal. it answers to things.</div>' +
      '<div class="sub">start with <span class="b">help</span>, or go straight for ' +
      "<span class=\"b\">who</span>, <span class=\"b\">stuff</span>, " +
      '<span class="b">ls</span>.</div>' +
      '<div class="sub">want to say something back? <span class="b">msg</span> ' +
      "&lt;anything&gt; — i do read them.</div>" +
      '<div class="sub dim">(and yes, <span class="b">sudo</span> works exactly as well as it does at home.)</div>',
    "boot-hint"
  );

  refreshStars();
  renderInput();

  // Autofocus only where a keyboard is already present -- on touch devices this
  // would throw up the on-screen keyboard before the visitor has read anything.
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    input.focus();
  }
})();
