(function () {
  var TITLES = [
    { id: 1, t: "Signal Lost", y: 2026, r: "TV-MA", len: "2 seasons", g: ["Sci-Fi", "Thriller"], h: [265, 215], d: "A deep-space relay crew starts picking up their own voices on a channel that shouldn't exist. Every message arrives an hour before they say it." },
    { id: 2, t: "IRON-MAN 3 ", y: 2013, r: "PG-13", len: "2h 10m", g: ["Science fiction"], h: [200, 230], d: "Plagued with worry and insomnia since saving New York from destruction, Tony Stark (Robert Downey Jr.), now, is more dependent on the suits that give him his Iron Man persona -- so much so that every aspect of his life is affected, including his relationship with Pepper (Gwyneth Paltrow). After a malevolent enemy known as the Mandarin (Ben Kingsley) reduces his personal world to rubble, Tony must rely solely on instinct and ingenuity to avenge his losses and protect the people he loves." },
    { id: 3, t: "Paper Kingdoms", y: 2026, r: "TV-Y7", len: "3 seasons", g: ["Animation", "Family"], h: [40, 340], d: "Two siblings fold a map into a kingdom, and now the kingdom won't stop growing." },
    { id: 4, t: "Midnight Ledger", y: 2024, r: "TV-MA", len: "1 season", g: ["Crime", "Thriller"], h: [150, 190], d: "A quiet accountant finds a second set of books, and someone knows she's read them." },
    { id: 5, t: "Salt & Ember", y: 2025, r: "PG-13", len: "1h 40m", g: ["Romance", "Drama"], h: [15, 330], d: "Two rival chefs are forced to share one tiny kitchen on a ferry that only runs at night." },
    { id: 6, t: "Orbit Kitchen", y: 2026, r: "TV-PG", len: "2 seasons", g: ["Comedy", "Reality"], h: [30, 280], d: "Home cooks compete inside a working space-station set where the pans float and the timers don't." },
    { id: 7, t: "Hollow Creek", y: 2023, r: "TV-MA", len: "1 season", g: ["Horror", "Mystery"], h: [120, 270], d: "The town's creek dries up overnight. What's left at the bottom is the reason nobody ever swam there." },
    { id: 8, t: "Fast Lane Sundays", y: 2025, r: "TV-14", len: "6 episodes", g: ["Documentary", "Sports"], h: [5, 25], d: "Six weekends inside the garages of an underfunded racing team chasing one podium." },
    { id: 9, t: "The Cartographer's Daughter", y: 2024, r: "PG", len: "2h 05m", g: ["Fantasy", "Adventure"], h: [45, 175], d: "She inherits an atlas of places that haven't been discovered yet, and a rival who wants it burned." },
    { id: 10, t: "Static Bloom", y: 2026, r: "TV-14", len: "1 season", g: ["Sci-Fi", "Mystery"], h: [310, 200], d: "Flowers begin growing inside dead televisions across the city. Each one plays a different memory." },
    { id: 11, t: "Dust Road", y: 2022, r: "R", len: "1h 58m", g: ["Western"], h: [28, 12], d: "A retired courier agrees to one last delivery across a desert that has stopped appearing on maps." },
    { id: 12, t: "Neon Alibi", y: 2025, r: "TV-MA", len: "2 seasons", g: ["Crime", "Mystery"], h: [320, 190], d: "Every witness in the case was in a different club that night. Every club says it was closed." },
    { id: 13, t: "Pocket Universe", y: 2025, r: "TV-Y", len: "4 seasons", g: ["Animation", "Family"], h: [190, 60], d: "A kid finds a tiny galaxy in her coat pocket and has to keep it fed, warm, and secret." },
    { id: 14, t: "The Understudy", y: 2024, r: "PG-13", len: "1h 35m", g: ["Comedy"], h: [55, 15], d: "The lead of a big-budget musical vanishes an hour before curtain. The understudy has never seen the second act." },
    { id: 15, t: "Tide Pull", y: 2026, r: "TV-G", len: "4 episodes", g: ["Documentary", "Nature"], h: [190, 220], d: "A year on one stretch of shoreline, filmed at the exact moment the water turns." },
    { id: 16, t: "Glass Orchard", y: 2023, r: "TV-14", len: "1 season", g: ["Mystery", "Drama"], h: [95, 165], d: "An apple grower discovers her trees were planted over something, and her family has always known." },
    { id: 17, t: "Backstage Riot", y: 2025, r: "TV-14", len: "1h 30m", g: ["Documentary", "Music"], h: [345, 20], d: "The chaotic week leading up to a band's first sold-out show, told from behind the curtain." },
    { id: 18, t: "Moon Farmers", y: 2026, r: "TV-PG", len: "3 seasons", g: ["Comedy", "Sci-Fi"], h: [70, 200], d: "The first agricultural colony on the moon has a soil problem, a staffing problem, and a goat problem." }
  ];
  var ROWS = [
    { name: "Trending now", ids: [1, 4, 3, 9, 12, 7, 2, 10] },
    { name: "New this month", ids: [18, 15, 3, 6, 10, 1, 8] },
    { name: "Sci-Fi & Fantasy", ids: [1, 10, 9, 18, 13, 2] },
    { name: "Crime & mystery", ids: [4, 12, 16, 7] },
    { name: "Feel-good picks", ids: [14, 6, 5, 13, 3, 18] },
    { name: "True stories", ids: [8, 15, 17, 2, 11] }
  ];
  var FEATURED = 1;

  var byId = {}; TITLES.forEach(function (x) { byId[x.id] = x; });
  var list = [];
  try { list = JSON.parse(localStorage.getItem("reelhouse-list") || "[]"); if (!Array.isArray(list)) list = []; } catch (e) { list = []; }
  function saveList() { try { localStorage.setItem("reelhouse-list", JSON.stringify(list)); } catch (e) {} }
  function inList(id) { return list.indexOf(id) !== -1; }
  function toggle(id) { if (inList(id)) list = list.filter(function (x) { return x !== id; }); else list.push(id); saveList(); refresh(); }

  var $ = function (id) { return document.getElementById(id); };
  var view = "home", query = "", openId = null;

  function art(x) { return "linear-gradient(160deg, hsl(" + x.h[0] + " 65% 38%), hsl(" + x.h[1] + " 70% 14%))"; }

  function card(x) {
    var b = document.createElement("button");
    b.className = "card"; b.style.background = art(x);
    b.setAttribute("aria-label", x.t + (inList(x.id) ? " (in My List)" : ""));
    b.innerHTML = '<span class="t"></span>' + (inList(x.id) ? '<span class="tick">✓</span>' : "");
    b.querySelector(".t").textContent = x.t;
    b.addEventListener("click", function () { openModal(x.id); });
    return b;
  }

  function renderRows() {
    var host = $("rows"); host.innerHTML = "";
    var isHome = view === "home" && !query;
    $("hero").style.display = isHome ? "flex" : "none";
    var lc = query.toLowerCase();

    if (query) {
      var hits = TITLES.filter(function (x) { return (x.t + " " + x.g.join(" ")).toLowerCase().indexOf(lc) !== -1; });
      if (!hits.length) { host.innerHTML = '<p class="empty">Nothing matches "' + query.replace(/[<>&"]/g, "") + '". Try a genre like crime or comedy.</p>'; return; }
      var g = document.createElement("div"); g.className = "grid";
      hits.forEach(function (x) { g.appendChild(card(x)); });
      host.appendChild(g); return;
    }
    if (view === "list") {
      if (!list.length) { host.innerHTML = '<p class="empty" style="margin-top:140px">Your list is empty. Open any title and tap + My List to save it here.</p>'; return; }
      var g2 = document.createElement("div"); g2.className = "grid";
      list.forEach(function (id) { g2.appendChild(card(byId[id])); });
      host.appendChild(g2); return;
    }
    ROWS.forEach(function (r) {
      var s = document.createElement("section"); s.className = "row";
      var h = document.createElement("h2"); h.textContent = r.name; s.appendChild(h);
      var strip = document.createElement("div"); strip.className = "strip";
      r.ids.forEach(function (id) { strip.appendChild(card(byId[id])); });
      s.appendChild(strip); host.appendChild(s);
    });
  }

  function renderHero() {
    var x = byId[FEATURED];
    $("heroArt").style.background = art(x);
    $("heroKicker").textContent = x.g.join(", ") + " · " + x.y;
    $("heroTitle").textContent = x.t;
    $("heroDesc").textContent = x.d;
    $("heroList").textContent = inList(x.id) ? "✓ In My List" : "+ My List";
  }

  function refresh() {
    renderHero(); renderRows();
    if (openId) { $("mList").textContent = inList(openId) ? "✓ In My List" : "+ My List"; }
  }

  function setView(v) {
    view = v; query = ""; $("q").value = "";
    $("tabHome").setAttribute("aria-current", v === "home");
    $("tabList").setAttribute("aria-current", v === "list");
    window.scrollTo(0, 0); refresh();
  }

  /* MODAL */
  function openModal(id) {
    var x = byId[id]; openId = id;
    $("mBanner").style.background = art(x);
    $("mTitle").textContent = x.t;
    $("mMeta").innerHTML = '<span>' + x.y + '</span><span class="r">' + x.r + '</span><span>' + x.len + '</span><span>' + x.g.join(", ") + '</span>';
    $("mDesc").textContent = x.d;
    $("mList").textContent = inList(id) ? "✓ In My List" : "+ My List";
    $("modal").classList.add("show");
  }
  function closeModal() { $("modal").classList.remove("show"); openId = null; }
  $("modal").addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) closeModal(); });
  $("mList").addEventListener("click", function () { if (openId) toggle(openId); });
  $("mPlay").addEventListener("click", function () { if (openId) { var id = openId; closeModal(); play(id); } });

  /* PLAYER */
  var pTimer = null, pct = 0, playing = true, playingId = null;
  function play(id) {
    playingId = id; pct = 0; playing = true;
    $("pTitle").textContent = byId[id].t;
    $("pToggle").textContent = "Pause";
    $("player").classList.add("show");
    clearInterval(pTimer);
    pTimer = setInterval(function () {
      if (!playing) return;
      pct = Math.min(100, pct + 0.4);
      $("pBar").style.width = pct + "%";
      $("pTime").textContent = Math.round(pct) + "% watched";
      if (pct >= 100) { playing = false; $("pToggle").textContent = "Watch again"; }
    }, 200);
  }
  function stopPlayer() { clearInterval(pTimer); $("player").classList.remove("show"); }
  $("pToggle").addEventListener("click", function () {
    if (pct >= 100) { pct = 0; playing = true; $("pToggle").textContent = "Pause"; return; }
    playing = !playing; $("pToggle").textContent = playing ? "Pause" : "Resume";
  });
  $("pBack").addEventListener("click", stopPlayer);

  /* HERO + NAV */
  $("heroPlay").addEventListener("click", function () { play(FEATURED); });
  $("heroList").addEventListener("click", function () { toggle(FEATURED); });
  $("heroInfo").addEventListener("click", function () { openModal(FEATURED); });
  $("tabHome").addEventListener("click", function () { setView("home"); });
  $("tabList").addEventListener("click", function () { setView("list"); });
  $("searchBtn").addEventListener("click", function () {
    var s = $("search"); s.classList.toggle("open");
    if (s.classList.contains("open")) $("q").focus(); else { $("q").value = ""; query = ""; refresh(); }
  });
  $("q").addEventListener("input", function (e) { query = e.target.value.trim(); window.scrollTo(0, 0); refresh(); });
  window.addEventListener("scroll", function () { $("nav").classList.toggle("solid", window.scrollY > 30 || view !== "home" || !!query); }, { passive: true });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if ($("player").classList.contains("show")) stopPlayer(); else closeModal(); } });

  refresh();

  /* INTRO */
  (function () {
    var intro = document.getElementById("intro");
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    var wait = reduced ? 300 : 2000;
    setTimeout(function () {
      intro.classList.add("hide");
      document.body.style.overflow = "";
      setTimeout(function () { intro.style.display = "none"; }, 600);
    }, wait);
  })();
})();