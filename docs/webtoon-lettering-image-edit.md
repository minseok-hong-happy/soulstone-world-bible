# 1화 후반 컷 구성 보정

- 도구: 내장 이미지 생성 도구
- 최종 이미지: `site/assets/webtoon-v2/ep-01/page-3.jpg`
- 보정 사유: 다섯 장면으로 합쳐진 그림을 여섯 장면으로 분리. 가족 장면 세 개를 유지하고 정찰·혈흔 확인·보고 표식 장면을 분리했다.
- 리더는 실제 그림의 수평 경계를 측정해 표시하므로 컷 높이가 조금 달라도 장면 중간이 잘리지 않는다.

## 최종 편집 프롬프트

Use case: precise-object-edit. EDIT the attached six-panel anime comic by EXPANDING IT VERTICALLY. Output dimensions: 1024 pixels WIDE by 3072 pixels HIGH, a very tall 1:3 portrait page. NOT 1024x1536. The input is too short and its panels are too wide. Keep exactly SIX horizontal panels but make EACH panel 1024x512, 2:1 landscape aspect ratio. The six equal rows occupy 0-512, 512-1024, 1024-1536, 1536-2048, 2048-2560, 2560-3072 vertically. Extend each scene above and below by drawing more of the cave, torso, ground or night forest; do NOT stretch faces. Keep all six existing scene contents in their current order and all faces/costumes: (1) silver-haired mother and young silver-haired boy at locket, (2) old family portrait parents and two young boys with wolf, (3) mother strokes boy hair, (4) ordinary black-haired human scouts stop in night forest, (5) close gloved hand examines dried blood and damaged uniform on rock, (6) scout paints red rock marker and messenger rides downhill. Same light detailed 2D anime cel shading, black ink outlines. Room around characters for separately rendered dialogue. Exactly SIX panels, with thin full-width straight horizontal white gutters, NO text, speech bubbles, lettering or labels. Critical correction: final canvas is TWICE AS TALL as the source, without adding or removing panels.
