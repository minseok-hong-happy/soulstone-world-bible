(function () {
  'use strict';
  var root = document.querySelector('#reader-app');
  var select = document.querySelector('#episode-select');
  var toggle = document.querySelector('#bubble-toggle');
  var data = SOULSTONE_WEBTOON_V2.episodes;
  var numbers = Object.keys(data).map(Number).sort(function(a,b){return a-b;});
  var requested = Number(new URLSearchParams(location.search).get('ep'));
  var current = numbers.includes(requested) ? requested : 1;
  function escape(value) {
    return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function bubble(b) {
    var type = b.type.split(' ');
    var narration = type.includes('narration') || type.includes('classified');
    var speaker = b.speaker && !narration && !type.includes('sfx') ? '<span class="speaker">'+escape(b.speaker)+'</span>' : '';
    return '<div class="dialogue '+escape(b.type)+' '+escape(b.side)+'">'+speaker+'<span>'+escape(b.text)+'</span></div>';
  }
  var episode = data[current];
  document.title = current+'화 '+episode.title+' · 소울스톤';
  select.innerHTML = numbers.map(function(n){return '<option value="'+n+'"'+(n===current?' selected':'')+'>'+String(n).padStart(2,'0')+'화 · '+escape(data[n].title)+'</option>';}).join('');
  var panels = episode.pages.map(function(page,pageIndex){
    return page.panels.map(function(panel,row){
      var index = pageIndex*6+row;
      var dialogue = panel.bubbles.map(bubble).join('');
      return '<section class="comic-panel" id="panel-'+(index+1)+'" aria-label="'+escape(panel.alt)+'">'+
        (dialogue?'<div class="dialogue-space">'+dialogue+'</div>':'')+
        '<div class="panel-art"><img src="'+escape(page.image)+'" alt="'+escape(panel.alt)+'" style="--row:'+row+'" width="1024" height="3072"'+(index===0?' fetchpriority="high"':' loading="lazy"')+' decoding="async"></div></section>';
    }).join('');
  }).join('');
  if(episode.legacy){
    panels=episode.legacy.map(function(strip,index){
      var source=strip.image.replace(/^strips\//,'assets/webtoon/').replace(/\.png$/i,'.jpg');
      return '<figure class="legacy-strip" id="strip-'+(index+1)+'"><img src="'+escape(source)+'" alt="'+escape(strip.alt)+'"'+(index===0?' fetchpriority="high"':' loading="lazy"')+'>'+strip.bubbles.map(function(b){
        return '<div class="legacy-bubble '+escape(b.type)+' '+escape(b.side)+(b.tail?' tail-'+escape(b.tail):'')+'" style="top:'+Number(b.top)+'%;width:'+Number(b.width)+'%">'+escape(b.text)+'</div>';
      }).join('')+'</figure>';
    }).join('');
  }
  var previous = current>1?'<a href="?ep='+(current-1)+'">← 이전 화</a>':'';
  var next = current<60?'<a class="next-episode" href="?ep='+(current+1)+'">다음 화 →</a>':'<a class="next-episode" href="index.html">처음 화면으로</a>';
  root.innerHTML='<article class="reader"><header class="episode-head"><small>EPISODE '+String(current).padStart(2,'0')+'</small><h1>'+escape(episode.title)+'</h1><p>'+escape(episode.intro)+'</p><p class="edition-note">'+(episode.updated?'개편판 · 새 그림과 분리형 말풍선':'기존판 · 새 그림은 회차별로 순차 반영 중')+'</p></header>'+panels+'<footer class="episode-end"><strong>'+current+'화 끝</strong><nav class="episode-nav">'+previous+'<a href="episodes.html">전체 회차</a>'+next+'</nav><a class="novel-link" href="novel.html#episode-'+String(current).padStart(2,'0')+'">소설로 읽기</a></footer></article>';
  select.addEventListener('change',function(){location.href='?ep='+select.value;});
  toggle.addEventListener('click',function(){var hidden=document.body.classList.toggle('bubbles-hidden');toggle.textContent=hidden?'대사 보기':'그림만 보기';toggle.setAttribute('aria-pressed',String(!hidden));});
  try{localStorage.setItem('soulstone-webtoon-last',String(current));}catch(e){}
})();
