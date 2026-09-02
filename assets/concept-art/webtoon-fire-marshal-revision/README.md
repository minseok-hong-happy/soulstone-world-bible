# 2대 국가원수 정본 반영 — 48~51화 이미지 수정

## 목적

2대 국가원수의 폐기된 용 유물 시각 설정을 제거하고, 사용자가 선택한 **10번 회색 방랑 검성**을 웹툰 정본에 반영했다.

- 잿빛 장발
- 붉은 이마 소울스톤
- 낡은 검은 외투와 검붉은 장식
- 정확히 한 자루의 가느다란 칼
- 거대한 화염 소환 대신 칼날과 보법에 압축한 가느다란 불의 선
- 용, 비늘, 날개, 뿔, 발톱, 용 유물, 떠 있는 보석 없음

## 제작 범위

- 48화 6번째 스트립
- 49화 1~6번째 스트립
- 50화 6번째 스트립
- 51화 1~5번째 스트립
- 49·50·51화 가로형 대표 이미지

PNG는 Codex 내장 이미지 생성·편집 모드가 만든 고해상도 원본이다. `site/assets/webtoon/`에는 기존 웹툰 스트립과 같은 크기의 최적화 JPEG를 연결했다.

## 프롬프트 세트

모든 장면은 기존 스트립을 첫 번째 참조로 넣어 세로 3단 구성, 배경, 말풍선 여백과 애니메이션 톤을 유지했다. 두 번째 참조는 `second-marshal-10-gray-wanderer-marshal.jpg`, 결투 장면의 추가 참조는 `03-first-marshal-lord-of-frozen-crown-anime-v4.jpg`다.

공통 지시는 다음과 같다.

```text
Preserve the exact three-panel vertical Korean webtoon layout, ruined-castle continuity,
blank speech-bubble spaces, crisp modern 2D action-anime linework and restrained cel shading.
Replace the Second Marshal with the canonical gray wanderer: long ash-gray hair,
red forehead fire Soulstone, worn black coat with dark crimson trim, exactly one narrow sword.
Fire appears as a razor-thin compressed orange-red line along blade path and footwork.
No dragon, scales, wings, horns, claws, dragon relic, floating gem, gold armor,
extra swords, giant elemental creature, printed text, logo or watermark.
```

장면별로 불검의 첫 일격, 젊은 주인공과의 대치, 1대 원수의 개입, 얼음 보법, 검술 공방, 이념 대화와 마지막 교차를 지정했다. 49화 5번째 스트립은 주인공이 노인처럼 나온 첫 결과를 폐기하고 18세 주인공 정본을 추가 참조해 다시 제작했다. 50화 6번째 스트립도 1대 원수의 가슴에 생긴 잘못된 파란 문양을 제거하고 이마의 작은 진주빛 소울스톤만 남기도록 재편집했다.
