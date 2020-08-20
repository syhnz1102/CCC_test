<template>
  <div class="wrapper">
    <Popup
      v-if="popup.on"
      v-bind:type="popup.type"
      v-bind:title="popup.title"
      v-bind:contents="popup.contents"
      v-bind:option="popup.option"
      v-bind:ok="handlePopupOkBtnClick"
      v-bind:cancel="handlePopupCancelBtnClick"
    />
    <div class="toast wow animate__animated animate__fadeOut" data-wow-duration="1.5s" v-if="toast">
      <p>{{ toast }}</p>
    </div>
    <div id="VideoContainer" class="videoContainer" v-bind:class="{close: isCollapsedVideo}">
      <div class="shareContainer" v-bind:style="{display: (share ? 'block' : 'none')}" ref="share" @mouseover="handleBtnArea" @click="handleBtnArea">
        <div class="shareVideo">
          <div class="video" v-bind:style="{display: (share && !share.isSharer ? 'block' : 'none')}">
            <video id="ShareVideo"></video>
          </div>
          <div class="share" v-if="share && share.isSharer">
            <div class="content">
                <img src="../assets/images/img_screen_share_sharing.gif" alt="">
                <p>{{ $t('call-share-contents-1') }}<br />
                {{ $t('call-share-contents-2') }}</p>
                <button @click="handleShareEndBtnClick">{{ $t('call-share-button') }}</button>
            </div>
          </div>
        </div>
      </div>
      <div id="MainVideoContainer" class="mainVideoContainer" v-bind:style="{display:share ? 'block' : 'none'}" @mouseover="handleBtnArea">
        <div class="button">
          <button @click="handleCollapseBtnClick">열기</button>
        </div>
      </div>
      <div id="MainVideo" class="mainVideo" v-bind:class="videoDisplayType" ref="mainVideo" @mouseover="handleBtnArea" @click="handleBtnArea">
        <template v-for="v in videos">
          <Video
            :key="v.id"
            v-bind:isOffVideo="v.isOffVideo"
            v-bind:isOffMic="v.isOffMic"
            v-bind:isLocal="v.isLocal"
            v-bind:vid="v.id"
            v-bind:userName="v.userName"
            @mouseover="handleBtnArea"
            @click="handleBtnArea"
          />
        </template>
        <template v-for="(v, idx) in offVideos">
          <OffVideo
            :key="idx"
            @mouseover="handleBtnArea"
            @click="handleBtnArea"
          />
        </template>
      </div>
    </div>
    <div @click="handleBtnArea" class="buttonInfo" v-if="buttonInfo">
      <strong>MENU</strong>
      <p><span>{{ buttonInfo.message }}</span><br />  {{ $t('call-menu-information-2') }}</p>
    </div>
    <div ref="btnArea" @mouseover="handleBtnArea" @mouseleave="handleBtnArea" style="position:fixed;display:flex;justify-content:center;align-items:flex-end;width:100%;bottom:0;height:20px;"></div>
    <Buttons ref="btn" v-bind:isVisible="visibleBtnArea" @mouseover="handleBtnArea" class="wow animate__animated animate__fadeIn animate__faster" />
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';
import { sendMessage } from '../commons/message';
import webRTC from '../commons/webrtc';
import Session from '../commons/session';
import config from '../config';
import mobile from '../commons/mobile';

import Video from '@/components/Video';
import OffVideo from '@/components/OffVideo';
import Popup from '@/components/Popup';
import Buttons from '@/components/Buttons';
import utils from "../commons/utils";
import store from "../store";

export default {
  components: { Video, OffVideo, Buttons, Popup },
  data () {
    return {
      videos: [],
      offVideos: [],
      videoDisplayType: 'one',
      share: null,
      visibleBtnArea: false,
      isCollapsedVideo: false,
      constraint: {
        width: { min: 128, ideal: config.constraints.p2p.width },
        height: { min: 72, ideal: config.constraints.p2p.height },
        frameRate: { ideal: 20, max: 20 },
        aspectRatio: 16/9.0
      },
      popup: {
        on: false,
        type: '',
        title: '',
        contents: '',
        option: {},
        ok: null,
        cancel: null
      },
      toast: '',
      buttonInfo: {
        on: true,
        message: this.$t('call-menu-information-pc-1')
      }
    }
  },
  beforeCreate() {
    // 200812 ivypark, v1.1.0a. 영문화 적용. initialize
    this.$i18n.locale = (mobile.isMobile ? this.$store.state.language : window.localStorage.getItem('locale')) || 'ko';
    this.$store.commit('setLanguage', this.$i18n.locale);
  },
  async created() {
    // 200625 ivypark, v1.0.0a deeplink 추가
    // if (mobile.isMobile && !mobile.isWebView) {
    //   location.href = `Intent://kp.cococall?roomid=${window.location.href.split('/room/')[1]}#Intent;scheme=kpoint;package=kr.co.knowledgepoint.knowledgetalkccc;end`;
    //   return false;
    // }

    if (mobile.isMobile) {
      // 200622 ivypark, v0.9.4. mobile 코드 추가 (back 버튼, 방 나가기 이벤트)
      Object.assign(window, { kpCCC_Android: {} });
      window.showExitPopup = mobile.showExitPopup;
      window.exitRoom = mobile.exitRoom;
      // 200713 ivypark. v1.0.6. 모바일 화면에서 메뉴가이드 메시지 변경
      this.buttonInfo.message = this.$t('call-menu-information-app-1');
    }

    // 200618 ivypark, v0.9.3. 새로 고침 시 동일한 방에 입장이 불가능 하도록 변경. 변경 실패. TODO.
    // if (window.performance) {
    //   console.info("window.performance is supported");
    // }
    // if (performance.navigation.type === 1) {
    //   webRTC.clear();
    //   window.location.href = '/';
    //   return false;
    // }

    // 200616 ivypark, v0.9.1. 이벤트 중복 적용 방어. (통화 종료 후 다시 render 시 $on listener가 중복으로 적용 되는 현상 발견)
    if (Object.keys(eBus._events).length) eBus._events = {};
    eBus.$on('video', param => {
      if (param.type === 'add') {
        this.setDisplay(param.count, param.id, this.share);
        this.addVideo(param.isLocal, param.id, param.stream, param.info);
      } else if (param.type === 'remove') {
        this.setDisplay(param.count, param.id, this.share);
        this.removeVideo(param.id);
      } else if (param.type === 'set') {
        eBus.$emit('setVideo', param)
        // this.setVideo(param);
      }
    });

    eBus.$on('share', param => {
      if (param.type === 'add') {
        this.addVideo(param.isLocal, param.id, param.stream);
        this.changeDisplay(param.type === 'add', param.count);
      } else if (param.type === 'remove') {
        let isSharer = param.hasOwnProperty('isSharer') ? param.isSharer : (this.share && this.share.isSharer ? this.share.isSharer : false)
        this.handleShareEndBtnClick(isSharer);
      }
    });

    eBus.$on('popup', param => {
      this.popup.on = param.on;
      this.popup.type = param.type;
      this.popup.title = param.title;
      this.popup.contents = param.contents;
      this.popup.option = param.option;
      this.popup.ok = param.ok;
      this.popup.cancel = param.cancel;
    });

    // 200702 ivypark, v1.0.1. 토스트 <-> 팝업 분리 (확인 버튼 클릭 시 팝업 창 종료를 위해)
    eBus.$on('toast', (content) => {
      this.emitToast(content)
    })

    if (await webRTC.checkMediaDevices()) {
      let stream = await webRTC.createVideoStream();
      this.addVideo(true, 'local', stream);

      // 200730 ivypark, v1.1.0b. 비즈니스 버전 (ip, cp 체크)
      utils.setPrivateInfo(this.$route.params.cp);
      this.init();
    } else {
      if (this.$store.state.socket && this.$store.state.roomInfo) {
        webRTC.destroyRoom();
        webRTC.clear();
      }

      this.$router.push({ path: '/' });
    }
  },
  destroyed() {
    // 200730 ivypark, v1.0.8. 통화 중 브라우저 뒤로 가기 버튼 누를 시 연결이 끊기지 않는 문제 수정
    webRTC.clear();
  },
  methods: {
    init() {
      if (mobile.isMobile) {
        // 200708 ivypark. v1.0.4. 모바일 화면에서 연결/종료가 되지 않는 문제 수정
        if (!this.$store.state.socket) new Session();
        sendMessage('RoomJoin', { roomId: window.location.href.split('/room/')[1]});
        return false;
      }

      // 200707 ivypark, v1.0.4. 최초 입장 시 디바이스 설정 다시 보지 않기에 체크 되어있다면 팝업 띄우지 않기
      let isChecked = window.localStorage.getItem('IS_CHECKED_DEVICE') && JSON.parse(window.localStorage.getItem('IS_CHECKED_DEVICE').toLowerCase())
      if (isChecked) {
        if (!this.$store.state.socket) new Session();
        sendMessage('RoomJoin', { roomId: window.location.href.split('/room/')[1] });
      } else {
        this.popup.on = true;
        this.popup.type = 'Settings';
        this.popup.title = this.$t('popup-setting-devices-title');
        this.popup.contents = this.$t('popup-setting-devices-contents-1');
        this.popup.option.inCall = false;
        this.popup.ok = () => {
          if (!this.$store.state.socket) new Session();
          sendMessage('RoomJoin', { roomId: window.location.href.split('/room/')[1] });
          eBus.$emit('setVideo', {
            type: 'set',
            id: 'local',
            deviceSetting: {
              done: true
            }
          });
        }
        this.popup.cancel = () => {
          window.location.href = '/';
        }
      }
    },
    handleBtnArea(e) {
      // 200625 ivypark, v1.0.0a 모바일과 버튼 이벤트 분리. 모바일은 화면 터치 시 버튼 나오도록 출력 개선
      if (mobile.isMobile && e.type === 'click') {
        this.visibleBtnArea = !this.visibleBtnArea;
      } else if (!mobile.isMobile && e.type !== 'click') {
        let style = 'position:fixed;display:flex;justify-content:center;align-items:flex-end;width:100%;bottom:0;height:20px;';
        this.visibleBtnArea = (e.type === 'mouseover' && e.target === this.$refs.btnArea) || e.type !== 'mouseover' && (e.target !== this.$refs.btnArea || e.target !== this.$refs.btn);
        this.$refs.btnArea.style = e.target !== this.$refs.mainVideo ? style + 'z-index:9' : style + 'z-index:11';
      }

      if (this.buttonInfo && this.visibleBtnArea) this.buttonInfo = false;
    },
    emitToast(content) {
      // 200702 ivypark, v1.0.1. 토스트 <-> 팝업 분리 (확인 버튼 클릭 시 팝업 창 종료를 위해)
      clearTimeout(this.timeout);
      this.toast = content;
      // 200702 ivypark, v1.0.1. 토스트 팝업 출력 1.5초로 변경
      // 200617 ivypark, v0.9.2. 토스트 팝업 출력 3초로 변경
      this.timeout = setTimeout(() => {
        this.toast = '';
      }, 1500)
    },
    handlePopupOkBtnClick(param) {
      this.popup.on = false;
      if (this.popup.ok) this.popup.ok(param);
    },
    handlePopupCancelBtnClick(param) {
      this.popup.on = false;
      if (this.popup.cancel) this.popup.cancel(param);
    },
    handleShareEndBtnClick(isSharer) {
      let s = this.$store.state
      this.removeVideo('screen');
      this.changeDisplay(false, s.roomInfo.count);
      if (isSharer) {
        sendMessage('SessionReserveEnd', { userId: s.userInfo.id, roomId: s.roomInfo.roomId })
        sendMessage('ScreenShareConferenceEnd', { userId: s.userInfo.id, roomId: s.roomInfo.roomId, useMediaSvr: s.roomInfo.count > 2 ? 'Y' : 'N' })
      }
    },
    handleCollapseBtnClick() {
      this.isCollapsedVideo = !this.isCollapsedVideo;
    },
    addVideo(isLocal, id, stream, info) {
      if (id === 'screen') {
        this.share = {
          id: 'screen',
          isSharer: isLocal,
          stream
        }

        document.getElementById('ShareVideo').srcObject = stream;
        document.getElementById('ShareVideo').autoplay = true;
      } else {
        // 200618 ivypark, v0.9.3. 기존 참여자가 카메라/마이크를 끈 상태로 신규 참여자 입장 시 Off 화면이 아닌 검정색 화면으로 출력, Mic Off 표시도 없던 문제 수정
        // Redis에 저장된 각각의 사용자의 이름, 비디오/마이크Off 여부를 Join시 Room 정보와 함께 전달 받아서 이곳에서 Video div로 출력함
        this.videos.push({
          id: isLocal ? 'local' : id,
          userName: info && info.name && info.name !== 'unknown' ? info.name : '익명',
          isOffVideo: info && info.isOffVideo ? info.isOffVideo : false,
          isOffMic: info && info.isOffMic ? info.isOffMic : false,
          isLocal
        })
      }
    },
    setVideo(param) {
      // 200615 ivypark, is NOT working (does not become re-rendering)....................
      // this.videos.forEach((curr, idx) => {
      //   if (curr.id === param.id && param.hasOwnProperty('isOffVideo')) {
      //     this.$set(this.videos, idx, Object.assign({}, this.videos[idx], { isOffVideo: param.isOffVideo }));
      //   }
      //   if (curr.id === param.id && param.hasOwnProperty('isOffMic')) {
      //     let list = [...this.videos];
      //     let obj = Object.assign({}, this.videos[idx], { isOffMic: param.isOffMic });
      //     list.splice(idx, 1, obj);
      //     this.videos = list;
      //   }
      //   if (curr.id === param.id && param.hasOwnProperty('name')) {
      //   }
      // })
    },
    removeVideo(id) {
      if (id === 'screen') {
        this.$store.commit('removePeerInfo', id);
        this.$store.commit('removeStreamInfo', id);
        this.share = null;
        document.getElementById('ShareVideo').srcObject = null;
      } else {
        if (!id) {
          this.videos = [];
          return;
        }

        this.$store.commit('removePeerInfo', id);
        this.$store.commit('removeStreamInfo', id);
        this.videos = this.videos.filter(c => c.id !== id);
      }
    },
    changeDisplay(isSharing, count) {
      if (isSharing) {
        // when started screen sharing
        document.getElementById('MainVideoContainer').appendChild(document.getElementById('MainVideo'));
        if (document.getElementById('local')) document.getElementById('local').classList.remove('local');
        this.setDisplay(undefined, undefined, true);
      } else {
        // when stopped screen sharing
        document.getElementById('VideoContainer').appendChild(document.getElementById('MainVideo'));
        if (document.getElementById('local') && count <= 2) document.getElementById('local').classList.add('local');
        this.setDisplay(this.$store.state.roomInfo.count, undefined, false);
      }
    },
    setDisplay(count, id, isSharing) {
      this.detachOffVideo();

      if (isSharing) {
        this.videoDisplayType = '';
        this.constraint.width.ideal = config.constraints.share.width;
        this.constraint.height.ideal = config.constraints.share.height;
        webRTC.setConstraint(this.constraint);
        return false;
      }

      if (count > 2) {
        if (document.getElementById('local')) document.getElementById('local').classList.remove('local');
        this.videos.forEach((c, idx) => {
          // 기존 1:1에서 나왔던 remote 영상 삭제
          if (c.id === 'remote') {
            // this.$store.commit('removePeerInfo', 'local');
            this.$store.commit('removeStreamInfo', 'remote');
            this.videos.splice(idx, 1);
          }
        })
      } else if (count <= 2) {
        if (document.getElementById('local')) document.getElementById('local').classList.add('local');
      }

      switch (count) {
        // 200617 ivypark, v0.9.2. 1명일 때 OffVideo 출력 되도록 변경
        case 1:
          if (count === 1) {
            this.videoDisplayType = 'one';
          }
        case 2:
          if (count === 2) {
            this.videoDisplayType = 'two';
          }

					this.constraint.width.ideal = config.constraints.p2p.width;
					this.constraint.height.ideal = config.constraints.p2p.height;
					break;

				case 3: this.attachOffVideo(1);
        case 4: if (count === 4) this.detachOffVideo();
          this.videoDisplayType = 'four';
					this.constraint.width.ideal = config.constraints.four.width;
					this.constraint.height.ideal = config.constraints.four.height;
					break;

				case 5: this.attachOffVideo(1);
        case 6: if (count === 6) this.detachOffVideo();
					this.videoDisplayType = 'six';
					this.constraint.width.ideal = config.constraints.six.width;
					this.constraint.height.ideal = config.constraints.six.height;
					break;

				case 7: this.attachOffVideo(2);
        case 8: this.attachOffVideo(1);
        case 9: if (count === 9) this.detachOffVideo();
					this.videoDisplayType = 'nine';
					this.constraint.width.ideal = config.constraints.nine.width;
					this.constraint.height.ideal = config.constraints.nine.height;
					break;

				case 10: this.attachOffVideo(2);
        case 11: this.attachOffVideo(1);
        case 12: if (count === 12) this.detachOffVideo();
					this.videoDisplayType = 'twelve';
					this.constraint.width.ideal = config.constraints.twelve.width;
					this.constraint.height.ideal = config.constraints.twelve.height;
					break;

				case 13: this.attachOffVideo(3);
        case 14: this.attachOffVideo(2);
        case 15: this.attachOffVideo(1);
        case 16: if (count === 16) this.detachOffVideo();
					this.videoDisplayType = 'sixteen';
					this.constraint.width.ideal = config.constraints.sixteen.width;
					this.constraint.height.ideal = config.constraints.sixteen.height;
					break;

				default:
					console.warn(`ambiguous remain value`);
					// this.videoDisplayType = 'sixteen';
					// this.constraint.width.ideal = config.constraints.sixteen.width;
					// this.constraint.height.ideal = config.constraints.sixteen.height;
					break;
      }

      webRTC.setConstraint(this.constraint);
    },
    attachOffVideo(cnt) {
      for (let i = 0; i < cnt && this.offVideos.length < cnt; i++) {
        this.offVideos.push(`<div class="video off"></div>`);
      }
    },
    detachOffVideo() {
      this.offVideos = [];
    }
  }
}
</script>
