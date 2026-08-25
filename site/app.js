(function () {
  "use strict";

  var rules = [
    ["영혼의 형태", "모든 인간과 괴물은 이마에 자신의 영혼인 소울스톤을 지니고 태어난다."],
    ["색과 성장", "색은 혈통·속성·성향·잠재력을 함께 담고, 성장할수록 크기가 아니라 힘의 밀도와 제어가 깊어진다."],
    ["죽음과 별", "죽는 즉시 소울스톤은 별똥별이 되어 거의 빛의 속도로 세계 어딘가에 떨어진다."],
    ["영혼의 금기", "소울스톤이 깨지면 영혼은 완전히 소멸한다. 돌을 파괴하는 일은 죽음보다 무거운 금기다."],
    ["유물의 주인", "낙하한 돌은 유물로 쓸 수 있지만, 강자의 기억과 인격이 남아 새 사용자를 거부하기도 한다."],
    ["공명과 침식", "동의를 얻으면 적은 대가로 깊은 힘을 쓰고, 강제로 사용하면 생명과 인격이 침식된다."],
    ["하나의 유물", "자신의 돌 외에는 한 번에 하나의 유물만 활성화할 수 있다. 서로 다른 영혼은 사용자를 붕괴시킨다."],
    ["쌍검의 예외", "일란성 쌍둥이 뱀파이어의 두 검은 파장이 같아 세계의 법칙상 하나의 유물로 인식된다."]
  ];

  var characters = [
    ["주인공과 늑대", "핵심", "assets/characters/anime-v4/01-protagonist-and-wolf-anime-v4.jpg", "인간과 뱀파이어의 혼혈 소년, 그리고 어떤 명령도 없이 스스로 소년을 살린 거대한 자연 늑대.", ["피와 얼음", "은백색 머리", "공존의 선택"]],
    ["첫째 형", "핵심", "assets/characters/anime-v4/02-older-brother-adaptive-evolution-anime-v4.jpg", "어릴 때 납치되어 장로회의 실험 병기와 비밀 4대 원수 후보로 성장한 주인공의 거울.", ["적응 진화", "회색 머리", "왜곡된 기억"]],
    ["1대 국가원수", "핵심", "assets/characters/anime-v4/03-first-marshal-lord-of-frozen-crown-anime-v4.jpg", "주인공의 외할아버지. 얼음을 발판으로만 사용하는 세계 최고의 검객이자 인간 통일의 책임자.", ["빙관의 군주", "검술", "속죄"]],
    ["비극 전의 가족", "핵심", "assets/characters/anime-v4/04-family-before-tragedy-anime-v4.jpg", "인간 어머니와 뱀파이어 아버지, 두 아들, 늑대가 함께했던 짧고 소중한 일상.", ["혼혈 가족", "가족사진", "마지막 밤"]],
    ["반인반수 지도부", "동맹", "assets/characters/anime-v4/05-beastfolk-leaders-anime-v4.jpg", "늑대인간이 유일한 최종 지도자이며 사자인간은 전투와 외교를 맡는 정식 2인자다.", ["야수와 바람", "늑대인간", "사자인간"]],
    ["트롤 대장", "동료", "assets/characters/anime-v4/06-troll-leader-anime-v4.jpg", "선조의 영혼과 약속을 중시하는 수정동굴의 젊은 지도자. 하나의 거대 수정 유물을 휘두른다.", ["충격 저장", "수정 병기", "약속"]],
    ["골렘 대장", "동료", "assets/characters/anime-v4/07-golem-leader-anime-v4.jpg", "기계가 아닌 자연의 광물 생명. 전투보다 방벽과 교량, 터널과 피난로를 만드는 데 강하다.", ["자연 골렘", "구조", "금빛 생명선"]],
    ["거미인간 대장", "동료", "assets/characters/anime-v4/08-spiderfolk-insect-alliance-anime-v4.jpg", "곤충 공동체를 대표하는 냉철한 여성 지도자. 실과 진동으로 거대한 정보망을 만든다.", ["극세 실", "진동 감지", "곤충 공동체"]],
    ["오크 검성", "동료", "assets/characters/anime-v4/09-orc-sword-saint-anime-v4.jpg", "움직이는 방벽 같은 체격과 달리 최소 동작과 정확한 거리로 주인공을 지키는 호위무사.", ["호위", "대검", "절대 거리"]],
    ["반인반용", "동료", "assets/characters/anime-v4/10-half-dragon-companion-anime-v4.jpg", "인간과 용 어느 쪽의 인정도 목표로 삼지 않는 혼혈 동료. 주인공이 자신의 혈통을 받아들이게 한다.", ["용의 혈통", "혼혈", "해군 대장전"]],
    ["버림받은 인간 셋", "동료", "assets/characters/anime-v4/11-abandoned-human-trio-anime-v4.jpg", "붉은 번개 주술사, 단검 요원, 도끼 전사. 연합의 명령보다 사람을 살리는 선택을 한 탈주자들.", ["실험 생존자", "전직 요원", "탈주 군인"]],
    ["인간 연합 지휘부", "인간연합", "assets/characters/anime-v4/12-human-alliance-command-anime-v4.jpg", "3대 원수와 네 군 대장. 같은 체제 안에서도 끝까지 학살을 택하는 자와 명령을 멈추는 자로 갈린다.", ["염동력", "네 군 대장", "정전"]],
    ["흑영대", "동맹", "assets/characters/anime-v4/13-shadow-unit-anime-v4.jpg", "인간과 괴물이 함께 구성한 그림자 특수부대. 암살보다 첩보, 구조, 기록 탈취와 대피로 확보가 우선이다.", ["그림자", "침투", "구조"]],
    ["어인족과 하피족", "동맹", "assets/characters/anime-v4/14-merfolk-and-harpy-allies-anime-v4.jpg", "바다와 하늘의 고향을 지키는 지역 동맹. 최종전에서 보급 차단과 민간인 대피를 맡는다.", ["바다", "하늘", "지역 동맹"]],
    ["살아 있는 성", "최종위기", "assets/characters/anime-v4/15-living-castle-final-battle-anime-v4.jpg", "50년간 모은 영혼과 성의 인공 기관에서 강제로 태어난 신생명. 악당이 아니라 마지막 희생자다.", ["성생체", "수많은 영혼", "마지막 희생자"]],
    ["12세 주인공", "핵심", "assets/characters/important/01-protagonist-age-12.jpg", "가족의 품 안에서 피와 얼음을 서툴게 익히던 소년. 동굴 학살이 그의 시간을 갈라놓는다.", ["12세", "붉은 눈과 푸른 눈"]],
    ["성장한 주인공", "핵심", "assets/characters/important/02-protagonist-age-18.jpg", "복수의 군주가 아니라 사람을 살리는 연합의 중심으로 성장한 주인공의 최종전 모습.", ["18세", "쌍검", "늑대 기승"]],
    ["뱀파이어 아버지", "핵심", "assets/characters/important/03-vampire-father.jpg", "복수를 억누르고 가족과 공동체를 지키기 위해 은신을 선택한 피 단일 속성의 지도자.", ["피", "공동체", "절제"]],
    ["얼음의 어머니", "핵심", "assets/characters/important/04-ice-mother.jpg", "1대 원수의 딸이자 강한 얼음 사용자. 자신의 생명으로 아들이 도망칠 시간을 만든다.", ["얼음", "1대 원수의 딸", "희생"]],
    ["2대 국가원수", "인간연합", "assets/characters/important/05-second-marshal-dragon-relic.jpg", "용의 유물 소울스톤을 사용하는 전대 원수. 최종전에서 1대 원수와 서로의 시대를 끝낸다.", ["용의 유물", "2대 원수"]],
    ["3대 국가원수", "인간연합", "assets/characters/important/06-third-marshal-telekinesis.jpg", "감정 표현이 거의 없는 염동력 사용자. 주인공에게 패배한 뒤 살아서 전군 정전을 명령한다.", ["밀기와 당기기", "무채색 회색", "정전"]],
    ["모래의 육군 대장", "인간연합", "assets/characters/important/07-army-commander-sand.jpg", "주인공의 부모를 죽이고 형을 병기로 훈련시킨 인물. 네 대장 중 유일하게 최종전에서 죽는다.", ["모래 병사", "폴암", "가족의 원수"]],
    ["바람의 공군 대장", "인간연합", "assets/characters/important/08-air-commander-wind.jpg", "압축 풍압과 광역 절단을 쓰는 공중전 지휘관. 늑대인간과 하피족에게 패배한다.", ["바람", "공중 기동"]],
    ["강철의 해군 대장", "인간연합", "assets/characters/important/09-navy-commander-steel.jpg", "강철을 녹이고 굳혀 파도와 창, 장갑으로 바꾸는 지휘관. 반인반용과 어인족이 맞선다.", ["강철", "해군"]],
    ["빛의 수비 대장", "인간연합", "assets/characters/important/10-defense-commander-light.jpg", "빛과 압도적인 완력을 쓰는 중갑 기사. 트롤 대장과 수정동굴 공동체가 성문에서 맞선다.", ["빛", "완력", "수비"]],
    ["육군 1번대 중장", "인간연합", "assets/characters/important/11-army-first-vice-admiral-shards.jpg", "거대한 검을 수많은 작은 칼날로 분해하는 여성 지휘관. 단검 사용자의 옛 상관이다.", ["분할 칼날", "여성 지휘관"]],
    ["일곱 가문 장로회", "인간연합", "assets/characters/important/12-elder-council.jpg", "소울스톤 독점과 괴물 절멸, 돌연변이 실험과 성생체 계획을 주도한 최종 적대 세력.", ["일곱 가문", "독점", "최종 적"]],
    ["붉은 번개 주술사", "동료", "assets/characters/important/13-red-lightning-shaman.jpg", "연합의 실험 생존자. 강한 출력을 쓸수록 신경과 감각에 고통이 남는다.", ["붉은 번개", "실험 생존자"]],
    ["단검 사용자", "동료", "assets/characters/important/14-dagger-operative.jpg", "민간인 학살 명령을 거부한 전직 정보 요원. 투척 궤도, 함정 해제와 기록 탈취에 능하다.", ["단검", "정보 요원"]],
    ["도끼 전사", "동료", "assets/characters/important/15-axe-deserter.jpg", "괴물 아이를 죽이라는 명령을 거부한 전직 군인. 인간 군대의 사고방식과 약점을 안다.", ["큰 도끼", "탈주 군인"]],
    ["어인족 지도자", "동맹", "assets/characters/important/16-merfolk-leader.jpg", "심해의 낙하 지점과 바다 생태를 지키며 최종전에서 해군의 보급과 수송로를 차단한다.", ["심해", "수로 대피"]],
    ["하피족 지도자", "동맹", "assets/characters/important/17-harpy-leader.jpg", "고산 기류와 별의 낙하를 읽는다. 공중 정찰과 민간인 대피로 하늘의 전선을 바꾼다.", ["관측", "공중 구조"]],
    ["엘프 중립국 치료사", "동맹", "assets/characters/important/18-elf-neutral-healer.jpg", "어느 군대에도 합류하지 않지만 모든 종족의 피난과 치료를 보장하는 중립의 상징.", ["식물", "치료", "중립국"]]
  ];

  var arcs = [
    { id: "all", label: "전체 60화", from: 1, to: 60 },
    { id: "fall", label: "1–8 · 붕괴와 생존", from: 1, to: 8 },
    { id: "alliance", label: "9–18 · 첫 동맹", from: 9, to: 18 },
    { id: "journey", label: "19–30 · 연합의 확장", from: 19, to: 30 },
    { id: "brother", label: "31–42 · 형의 진실", from: 31, to: 42 },
    { id: "war", label: "43–54 · 성을 향한 전쟁", from: 43, to: 54 },
    { id: "castle", label: "55–60 · 성벽 없는 아침", from: 55, to: 60 }
  ];

  var activeCharacterGroup = "전체";
  var activeArc = "all";
  var episodeQuery = "";

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function arcForEpisode(number) {
    return arcs.slice(1).find(function (arc) { return number >= arc.from && number <= arc.to; });
  }

  function renderRules() {
    document.querySelector("#rule-grid").innerHTML = rules.map(function (item, index) {
      return '<article class="rule-card reveal" data-number="' + pad(index + 1) + '"><span>' + pad(index + 1) + '</span><h3>' + item[0] + '</h3><p>' + item[1] + '</p></article>';
    }).join("");
  }

  function renderCharacterFilters() {
    var groups = ["전체"].concat(Array.from(new Set(characters.map(function (item) { return item[1]; }))));
    document.querySelector("#character-filters").innerHTML = groups.map(function (group) {
      return '<button class="filter-button' + (group === activeCharacterGroup ? ' active' : '') + '" type="button" data-group="' + group + '">' + group + '</button>';
    }).join("");
  }

  function renderCharacters() {
    var list = characters.filter(function (item) { return activeCharacterGroup === "전체" || item[1] === activeCharacterGroup; });
    document.querySelector("#character-grid").innerHTML = list.map(function (item) {
      var index = characters.indexOf(item);
      return '<article class="character-card reveal" tabindex="0" role="button" data-index="' + index + '" aria-label="' + item[0] + ' 자세히 보기"><img src="' + item[2] + '" alt="' + item[0] + '" loading="lazy"><div><small>' + item[1] + '</small><h3>' + item[0] + '</h3></div></article>';
    }).join("");
    observeReveals();
  }

  function openCharacter(index) {
    var item = characters[index];
    var dialog = document.querySelector("#character-dialog");
    document.querySelector("#dialog-image").src = item[2];
    document.querySelector("#dialog-image").alt = item[0];
    document.querySelector("#dialog-group").textContent = item[1];
    document.querySelector("#dialog-name").textContent = item[0];
    document.querySelector("#dialog-description").textContent = item[3];
    document.querySelector("#dialog-tags").innerHTML = item[4].map(function (tag) { return "<li>" + tag + "</li>"; }).join("");
    dialog.showModal();
  }

  function renderArcFilters() {
    document.querySelector("#arc-filters").innerHTML = arcs.map(function (arc) {
      return '<button class="filter-button' + (arc.id === activeArc ? ' active' : '') + '" type="button" data-arc="' + arc.id + '">' + arc.label + '</button>';
    }).join("");
  }

  function renderEpisodes() {
    var selectedArc = arcs.find(function (arc) { return arc.id === activeArc; }) || arcs[0];
    var query = episodeQuery.trim().toLowerCase();
    var episodes = Object.entries(SOULSTONE_WEBTOON).map(function (entry) {
      return [Number(entry[0]), entry[1]];
    }).filter(function (entry) {
      var number = entry[0], data = entry[1];
      var inArc = number >= selectedArc.from && number <= selectedArc.to;
      var searchable = (number + " " + data.title + " " + data.subtitle).toLowerCase();
      return inArc && (!query || searchable.indexOf(query) !== -1);
    });

    document.querySelector("#episode-grid").innerHTML = episodes.map(function (entry) {
      var number = entry[0], data = entry[1], arc = arcForEpisode(number);
      return '<article class="episode-card reveal"><a href="webtoon.html?ep=' + number + '"><div class="episode-thumb"><img src="assets/keyframes/ep-' + pad(number) + '.jpg" alt="' + number + '화 ' + data.title + ' 대표 이미지" loading="lazy"><span class="episode-number">EP ' + pad(number) + '</span></div><div class="episode-body"><small>' + arc.label.split("·").pop().trim() + '</small><h3>' + data.title + '</h3><p>' + data.subtitle + '</p><span>웹툰으로 읽기 →</span></div></a></article>';
    }).join("");
    document.querySelector("#episode-empty").hidden = episodes.length !== 0;
    observeReveals();
  }

  var observer;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (element) { element.classList.add("visible"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .08 });
    }
    document.querySelectorAll(".reveal:not(.visible)").forEach(function (element) { observer.observe(element); });
  }

  document.querySelector("#character-filters").addEventListener("click", function (event) {
    var button = event.target.closest("[data-group]");
    if (!button) return;
    activeCharacterGroup = button.dataset.group;
    renderCharacterFilters();
    renderCharacters();
  });

  document.querySelector("#character-grid").addEventListener("click", function (event) {
    var card = event.target.closest("[data-index]");
    if (card) openCharacter(Number(card.dataset.index));
  });
  document.querySelector("#character-grid").addEventListener("keydown", function (event) {
    var card = event.target.closest("[data-index]");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openCharacter(Number(card.dataset.index));
    }
  });

  document.querySelector(".dialog-close").addEventListener("click", function () { document.querySelector("#character-dialog").close(); });
  document.querySelector("#character-dialog").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  });

  document.querySelector("#arc-filters").addEventListener("click", function (event) {
    var button = event.target.closest("[data-arc]");
    if (!button) return;
    activeArc = button.dataset.arc;
    renderArcFilters();
    renderEpisodes();
  });
  document.querySelector("#episode-search").addEventListener("input", function (event) {
    episodeQuery = event.target.value;
    renderEpisodes();
  });

  var menuToggle = document.querySelector("#menu-toggle");
  var nav = document.querySelector("#site-nav");
  menuToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("scroll", function () {
    var max = document.documentElement.scrollHeight - innerHeight;
    var progress = max > 0 ? scrollY / max * 100 : 0;
    document.querySelector("#scroll-progress").style.width = progress + "%";
  }, { passive: true });

  document.querySelector("#build-year").textContent = new Date().getFullYear();
  renderRules();
  renderCharacterFilters();
  renderCharacters();
  renderArcFilters();
  renderEpisodes();
  observeReveals();
})();
