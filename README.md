# KnowledgeTalk-CCC

> KnowledgeTalk Convenient Conference Call

## Release Note
```
# v0.9.2 (20/06/18)
- (#4) 1:1 통화 중 화면공유 후 Mic / Cam off 시 Local 화면이 Container에서 분리되는 현상 수정
- (#6) 네트워크 망이 다른 경우 화면 정상 출력 되지 않는 현상 수정
- (#8) 공유화면 선택 창에서 ESC 혹은 취소 버튼 클릭 시 에러 출력되는 현상 수정
- (#9) 이름 변경 시 글자 제한, 공백 입력 되지 않도록 수정, Input 창에 현재 이름이 들어가도록 수정
- (#10) 기타 버그사항 수정/추가

# v0.9.1 (20/06/16)
- 이벤트 중복 적용 방어. (통화 종료 후 다시 render 시 $on listener가 중복으로 적용 되는 현상 발견)
- Confirm 팝업 추가, 디바이스 체크 시 참여 의사 확인
- Config.js 추가

# v0.9.0 (20/06/15)
- Web 메인 화면 : 페이지 디자인/퍼블리싱, Information 및 Guide 화면 제작, 회의 시작
- Web 통화 화면 및 Signal Server : 페이지 디자인/퍼블리싱
 + 각 버튼 이벤트 및 통화 기능, 팝업 화면
 + 1:1 통화 및 1:1 화면 공유 (P2P)
 + 다자 통화 및 다자 화면 공유 (Media Server relay)
 + 이름 변경, URL 복사
 + 카메라 / 마이크 On, Off (방의 모든 사람들이 알수 있도록 하였음)
 + 인원 수에 따른 해상도 변경
 + 화면 공유 시 Layout 변경
 + 다자 Layout에서 빈 화면을 off 화면으로 처리
 + 다자 -> 2명 통화로 변경 시 1:1 화면으로 전환
 + CreateRoom, StartSession, ChangeName Op 추가
 + 방장이 나가도 통화가 종료되지 않도록 변경
 + 기존 KnowledgeTalk Signal 서버와도 연동될 수 있도록 통합 제작.
```


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
