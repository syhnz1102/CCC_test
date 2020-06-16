# KnowledgeTalk-CCC

> KnowledgeTalk Convenient Conference Call

## Release Note
```
v1.0.0 (20/06/15)
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
