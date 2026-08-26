(function () {
  "use strict";
  var content = document.querySelector("#novel-content");
  var chapterList = document.querySelector("#chapter-list");

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function slug(index) { return "chapter-" + String(index).padStart(2, "0"); }

  function render(markdown) {
    var blocks = markdown.replace(/\r/g, "").trim().split(/\n\s*\n/);
    var chapterIndex = 0;
    var chapters = [];
    var html = blocks.map(function (block) {
      var clean = block.trim();
      if (/^# /.test(clean)) return "<h1>" + escapeHtml(clean.slice(2)) + "</h1>";
      if (/^## /.test(clean)) {
        chapterIndex += 1;
        var title = clean.slice(3);
        var id = slug(chapterIndex);
        chapters.push([id, title]);
        return '<h2 id="' + id + '">' + escapeHtml(title) + "</h2>";
      }
      if (/^> /.test(clean)) return "<blockquote>" + escapeHtml(clean.replace(/^>\s?/gm, "")) + "</blockquote>";
      return "<p>" + escapeHtml(clean.replace(/\n/g, " ")) + "</p>";
    }).join("");
    content.innerHTML = html;
    chapterList.innerHTML = chapters.map(function (chapter) {
      return '<a href="#' + chapter[0] + '">' + escapeHtml(chapter[1]) + "</a>";
    }).join("");
  }

  fetch("novel.md").then(function (response) {
    if (!response.ok) throw new Error("소설 원문을 불러오지 못했습니다.");
    return response.text();
  }).then(render).catch(function () {
    content.innerHTML = '<h1>소설을 열 수 없습니다</h1><p><a href="novel.md">원문 파일을 직접 열어주세요.</a></p>';
  });

  window.addEventListener("scroll", function () {
    var max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector("#reading-progress").style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  }, { passive: true });
})();
