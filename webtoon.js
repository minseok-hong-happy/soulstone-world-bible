(function () {
  "use strict";
  var root = document.querySelector("#reader-app");
  var select = document.querySelector("#episode-select");
  var toggle = document.querySelector("#bubble-toggle");
  var params = new URLSearchParams(location.search);
  var requested = Number(params.get("ep"));
  var episodeNumbers = Object.keys(SOULSTONE_WEBTOON).map(Number).sort(function (a, b) { return a - b; });
  var current = episodeNumbers.indexOf(requested) !== -1 ? requested : 1;

  function imagePath(path) {
    return path.replace(/^strips\//, "assets/webtoon/").replace(/\.png$/i, ".jpg");
  }

  function bubbleMarkup(bubble) {
    var classes = ["bubble"].concat(bubble.type.split(" "), [bubble.side]);
    if (bubble.tail) classes.push("tail-" + bubble.tail);
    return '<div class="' + classes.join(" ") + '" style="top:' + bubble.top + '%;width:' + bubble.width + '%">' + bubble.text + '</div>';
  }

  function renderSelect() {
    select.innerHTML = episodeNumbers.map(function (number) {
      var data = SOULSTONE_WEBTOON[number];
      return '<option value="' + number + '"' + (number === current ? " selected" : "") + '>' + String(number).padStart(2, "0") + "화 · " + data.title + '</option>';
    }).join("");
  }

  function renderEpisode(number) {
    var data = SOULSTONE_WEBTOON[number];
    if (!data) return;
    current = number;
    document.title = number + "화 " + data.title + " · 소울스톤";
    var previous = number > 1 ? '<a href="?ep=' + (number - 1) + '">← ' + (number - 1) + '화</a>' : "";
    var next = number < 60 ? '<a href="?ep=' + (number + 1) + '">' + (number + 1) + '화 →</a>' : "";
    var strips = data.strips.map(function (strip, index) {
      return '<figure class="strip" id="strip-' + (index + 1) + '"><img src="' + imagePath(strip.image) + '" alt="' + strip.alt + '"' + (index === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + '>' + strip.bubbles.map(bubbleMarkup).join("") + '</figure>';
    }).join("");
    root.innerHTML = '<article class="reader"><header class="episode-head"><small>EPISODE ' + String(number).padStart(2, "0") + '</small><h1>' + data.title + '</h1><p>' + data.subtitle + '</p></header>' + strips + '<footer class="episode-end"><strong>' + number + '화 끝</strong><nav class="episode-nav">' + previous + '<a href="episodes.html">60화 목록</a>' + next + '</nav></footer></article>';
    renderSelect();
    scrollTo({ top: 0, behavior: "auto" });
  }

  select.addEventListener("change", function () {
    location.href = "?ep=" + select.value;
  });
  toggle.addEventListener("click", function () {
    var hidden = document.body.classList.toggle("bubbles-hidden");
    toggle.textContent = hidden ? "말풍선 꺼짐" : "말풍선 켜짐";
    toggle.setAttribute("aria-pressed", String(!hidden));
  });
  renderEpisode(current);
})();
