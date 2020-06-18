<template>
  <div class="wrapper">
    <Popup
      v-if="popup.on"
      v-bind:type="popup.type"
      v-bind:title="popup.title"
      v-bind:contents="popup.contents"
      v-bind:ok="handlePopupOkBtnClick"
      v-bind:cancel="handlePopupCancelBtnClick"
    />
    <div id="VideoContainer"  class="videoContainer" v-bind:class="{close: isCollapsedVideo}">
      <div class="shareContainer" v-bind:style="{display: (share ? 'block' : 'none')}" ref="share" @mouseover="handleBtnArea">
        <div class="shareVideo">
          <div class="video" v-bind:style="{display: (share && !share.isSharer ? 'block' : 'none')}">
            <video id="ShareVideo"></video>
          </div>
          <div class="share" v-if="share && share.isSharer">
            <div class="content">
                <img src="../assets/images/img_screen_share_sharing.gif" alt="">
                <p>화면 공유중입니다.<br />
                화면 공유를 종료하시려면 아래 버튼을 클릭해주세요.</p>
                <button @click="handleShareEndBtnClick">화면 공유 종료</button>
            </div>
          </div>
        </div>
      </div>
      <div id="MainVideoContainer" class="mainVideoContainer" v-bind:style="{display:share ? 'block' : 'none'}" @mouseover="handleBtnArea">
        <div class="button">
          <button @click="handleCollapseBtnClick">열기</button>
        </div>
      </div>
      <div id="MainVideo" class="mainVideo" v-bind:class="videoDisplayType" ref="mainVideo" @mouseover="handleBtnArea">
        <template v-for="v in videos">
          <Video
            :key="v.id"
            v-bind:isOffVideo="v.isOffVideo"
            v-bind:isOffMic="v.isOffMic"
            v-bind:isLocal="v.isLocal"
            v-bind:vid="v.id"
            v-bind:userName="v.userName"
            @mouseover="handleBtnArea"
          />
        </template>
        <template v-for="(v, idx) in offVideos">
          <OffVideo
            :key="idx"
            @mouseover="handleBtnArea"
          />
        </template>
      </div>
    </div>
    <div ref="btnArea" @mouseover="handleBtnArea" @mouseleave="handleBtnArea" style="position:fixed;display:flex;justify-content:center;align-items:flex-end;width:100%;bottom:0;height:20px;"></div>
    <Buttons ref="btn" v-bind:isVisible="visibleBtnArea" @mouseover="handleBtnArea" @mouseleave="handleBtnArea" class="wow animate__animated animate__fadeIn animate__faster" />
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';
import { sendMessage } from '../commons/message';
import webRTC from '../commons/webrtc';
import Session from '../commons/session';
import config from '../config';

import Video from '@/components/Video';
import OffVideo from '@/components/OffVideo';
import Popup from '@/components/Popup';
import Buttons from '@/components/Buttons';

export default {
  components: { Video, OffVideo, Buttons, Popup },
  data () {
    return {
      videos: [],
      offVideos: [''],
      videoDisplayType: '',
      share: null,
      visibleBtnArea: false,
      isCollapsedVideo: false,
      constraint: {
        width: { min: 128, ideal: config.constraints.p2p.width },
        height: { min: 72, ideal: config.constraints.p2p.height },
        aspectRatio: 16/9.0
      },
      popup: {
        on: false,
        type: '',
        title: '',
        contents: '',
        ok: null,
        cancel: null
      }
    }
  },
  async created() {
    // 200616 ivypark, v0.9.1. 이벤트 중복 적용 방어. (통화 종료 후 다시 render 시 $on listener가 중복으로 적용 되는 현상 발견)
    if (Object.keys(eBus._events).length) eBus._events = {};
    eBus.$on('video', param => {
      if (param.type === 'add') {
        this.setDisplay(param.count, param.id, this.share);
        this.addVideo(param.isLocal, param.id, param.stream, param.name);
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
        this.handleShareEndBtnClick(param.isSharer || false);
      }
    });

    eBus.$on('popup', param => {
      this.popup.on = param.on;
      this.popup.type = param.type;
      this.popup.title = param.title;
      this.popup.contents = param.contents;
      this.popup.ok = param.ok;
      this.popup.cancel = param.cancel;
    });

    if (await webRTC.checkMediaDevices()) {
      if (!this.$store.state.socket) new Session();
      let stream = await webRTC.createVideoStream();

      sendMessage('RoomJoin', { roomId: window.location.href.split('/room/')[1]})
      this.addVideo(true, 'local', stream);
    } else {
      if (this.$store.state.socket && this.$store.state.roomInfo) {
        webRTC.destroyRoom();
        webRTC.clear();
      }

      this.$router.push({ path: '/' });
    }
  },
  methods: {
    handleBtnArea(e) {
      let style = 'position:fixed;display:flex;justify-content:center;align-items:flex-end;width:100%;bottom:0;height:20px;';
      this.visibleBtnArea = (e.type === 'mouseover' && e.target === this.$refs.btnArea) || e.type !== 'mouseover' && (e.target !== this.$refs.btnArea || e.target !== this.$refs.btn);
      this.$refs.btnArea.style = e.target !== this.$refs.mainVideo ? style + 'z-index:9' : style + 'z-index:11';
    },
    handlePopupOkBtnClick(param) {
      if (param && param.name) sendMessage('ChangeName', { userId: param.id, roomId: this.$store.state.roomInfo.roomId, name: param.name }, 'signalOp');
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
    addVideo(isLocal, id, stream, name) {
      if (id === 'screen') {
        this.share = {
          id: 'screen',
          isSharer: isLocal,
          stream
        }

        document.getElementById('ShareVideo').srcObject = stream;
        document.getElementById('ShareVideo').autoplay = true;
      } else {
        this.videos.push({
          id: isLocal ? 'local' : id,
          userName: name ? name : '익명',
          isOffVideo: false,
          isOffMic: false,
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
        case 1: this.attachOffVideo(1);
        case 2: if (count === 2) this.detachOffVideo();
					this.videoDisplayType = '';
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
