# KnowledgeTalk-CCC

> KnowledgeTalk Convenient Conference Call (CoCoCall)

## Release Note
##### (http://knowledgepoint.co.kr:3000/SolutionDeveloper/KnowledgeTalkCCC/issues)
```
# v1.0.6 (20/07/13)
- 메인화면 Release Note 링크 (공지/업데이트) 추가
- 화면공유 진행 중 회의에 혼자만 남게 된 경우 화면 공유 종료되도록 수정 (#38)
- 통화 화면 메뉴 가이드 추가
- 디바이스 설정 팝업 다시 보지 않기 후 재진입하여 메뉴 - 설정 확인 시 스피커 선택되어 있지 않던 문제 수정 (#39)

# v1.0.5 (20/07/09)
- 회의 참여하기 기능 추가 (#32)
- 기능 개선: input enter 키, 디바이스 세팅 팝업 닫기 버튼, 이름 레이블 위치 변경 등 (#36)
- RoomId를 기존 12자에서 8자로 변경

# v1.0.4b (20/07/08 beta)
- 디바이스 설정 팝업에서 스피커 정보도 세팅되도록 수정 (#35)
- 모바일에서 회의 종료가 정상적으로 되지 않던 문제 수정 (1.0.4 side effect)

# v1.0.4 (20/07/08) *** DID NOT RELEASED ***
- 디바이스 설정 팝업 추가, 회의 시작 전 디바이스 설정 팝업 나타나도록 수정 (#35)

# v1.0.3 (20/07/06)
- 메인 화면 변경 (로고, 문구 변경)
- 지원 되지 않는 브라우저 (IE, Firefox, Opera, Safari 등)에서 접속 시 안내 페이지 추가
- Constraint 변경 (해상도 한 단계 씩 낮춤, frame 20)

# v1.0.2 (20/07/03)
- 메인 특정 단어 강조, 앱 다운로드 화면 추가
- 특정 Device에서 연결 시 화면 출력이 매우 느린 현상 개선 (#31)
- 화면공유 -> 취소 후 다른 사람의 화면공유 시작되지 않는 문제 개선 (#23)

# v1.0.1a (20/07/02 alpha)
- 화면 off 시 소리가 나지 않던 문제 수정 (#30)
- 이름 변경 등 팝업 확인 시 팝업 종료되도록 수정 (#27)
- 토스트 팝업 종료 시간 3 -> 1.5초로 변경
- ICE SERVER 정보 변경 (#31)

# v1.0.0b (20/06/26 beta)
- 모바일에서 화면 공유 시 버튼 출력 되지 않던 이슈 수정 (#21)
- 이름 변경 시 최대 길이 12 -> 8로 수정 (#22)

# v1.0.0a (20/06/25 alpha)
- Deep link 추가 (web -> android app) (#18)
- Mobile 접속 시 화면공유 되지 않도록 수정 (#15)
- Mobile에서는 터치한 경우 버튼이 나오도록 화면 버튼 출력 개선 (#13)
- 다자 통화에서 참여자 입장 도중 참여자가 나가는 경우 화면이 나오지 않는 현상 수정 (#20)
- 다자 -> 모두 퇴장 -> 한 사람 입장 하여 1:1 시 비디오 출력 되지 않는 문제 수정 (#11)

# v0.9.4 (20/06/22)
- Android Java 연동 메소드 추가 (back 버튼, 방 나가기, 방 만들기)

# v0.9.3b (20/06/19 beta)
- Cam Off 시 이미지 변경
- 다자 연결에서 타 사용자 종료 시 Video 가 정상적으로 사라지지 않는 현상 수정 (Signal Server 수정 - processLeaveRoom) (#5)

# v0.9.3a (20/06/19 alpha)
- Footer 내용 변경
- 카메라/마이크를 모두 끈 상태로 신규 참여자 입장 시 Off 화면이 아닌 검정색 화면으로 출력, Mic Off 표시 없음 현상 수정 (#2)
- 1:1 화면공유 진행 중 신규 참여자 입장 시 진행 중인 화면 공유 stream을 받을 수 없는 문제 수정 (#3)

# v0.9.2 (20/06/18)
- 화면 공유 비디오 크기가 잘려서 나오던 현상 수정
- 1:1 통화 중 화면공유 후 Mic / Cam off 시 Local 화면이 Container에서 분리되는 현상 수정 (#4)
- 네트워크 망이 다른 경우 화면 정상 출력 되지 않는 현상 수정 (#6)
- 공유화면 선택 창에서 ESC 혹은 취소 버튼 클릭 시 에러 출력되는 현상 수정 (#8)
- 이름 변경 시 글자 제한, 공백 입력 되지 않도록 수정, Input 창에 현재 이름이 들어가도록 수정 (#9)
- 기타 버그사항 수정/추가 (#10)

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
