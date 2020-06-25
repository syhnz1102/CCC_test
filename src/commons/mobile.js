import { eBus } from "./eventBus";
import webRTC from "./webrtc";

class Mobile {
  isMobile = false; // Android 기본 Web Browser로 open 시
  isWebView = false; // Android App의 Web view 형태로 open 시

  constructor() {
    // 200622 ivypark, v1.0.0. mobile web view / web browser 구분 (deeplink 추가)
    this.isMobile = navigator.userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || navigator.userAgent.match(/LG|SAMSUNG|Samsung/) != null;
    this.isWebView = /KP_CCC_Android/i.test(navigator.userAgent);
    console.debug(`----- device: ${this.isMobile ? 'Android' : 'Web'} // Web View : ${this.isWebView} -----`);
  }

  createRoomRespCall(roomId) {
    console.log('mobile - onStartConference', roomId);
    window.kpCCC_Android.onStartConference(roomId);
  }

  // 200622 ivypark, v0.9.4. mobile 코드 추가 (back 버튼, 방 나가기 이벤트)
  showExitPopup() {
    console.log('mobile - showExitPopup');
    eBus.$emit('popup', {
      on: true,
      type: 'Confirm',
      title: '통화 종료',
      contents: `통화를 종료 하시겠습니까?`,
      ok: () => {
        webRTC.clear();
        eBus.$emit('video', {
          type: 'remove'
        })
        window.location.href = '/';
      }
    })
  }

  // 200622 ivypark, v0.9.4. mobile 코드 추가 (back 버튼, 방 나가기 이벤트)
  exitRoom() {
    webRTC.clear();
    eBus.$emit('video', {
      type: 'remove'
    })
    window.location.href = '/';
  }
}


export default new Mobile();
