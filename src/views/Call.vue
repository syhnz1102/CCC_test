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
    <div class="videoContainer" v-bind:class="{close: isCollapsedVideo}">
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
            v-bind:isLocal="v.isLocal"
            v-bind:vid="v.id"
            @mouseover="handleBtnArea"
          />
        </template>
      </div>
    </div>
    <div ref="btnArea" @mouseover="handleBtnArea" @mouseleave="handleBtnArea" style="position:fixed;display:flex;justify-content:center;align-items:flex-end;width:100%;bottom:0;height:20px;"></div>
    <Buttons ref="btn" v-bind:isVisible="visibleBtnArea" @mouseover="handleBtnArea" @mouseleave="handleBtnArea" class="wow animate__animated animate__fadeInUp animate__faster" />
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';
import { sendMessage } from '../commons/message';
import webRTC from '../commons/webrtc';
import Session from '../commons/session';

import Video from '@/components/Video';
import Popup from '@/components/Popup';
import Buttons from '@/components/Buttons';

export default {
  components: { Video, Buttons, Popup },
  data () {
    return {
      videos: [],
      visibleBtnArea: false,
      videoDisplayType: '',
      isSharing: false,
      isCollapsedVideo: false,
      share: null,
      constraint: {
        mWidth: 1280, mHeight: 960
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
    if (await webRTC.checkMediaDevices()) {
      if (!this.$store.state.socket) new Session();

      let stream = await webRTC.createVideoStream();
      sendMessage('CCC-Join', { roomId: window.location.href.split('/room/')[1]})
      this.setVideo(true, 'local', stream);

      eBus.$on('video', param => {
        if (param.type === 'add') {
          this.setDisplay(param.count, param.id);
          this.setVideo(param.isLocal, param.id, param.stream);
        }
      });

      eBus.$on('share', param => {
        if (param.type === 'add') {
          this.setVideo(param.isLocal, param.id, param.stream);
          this.changeDisplay(param.type === 'add', param.count);
        }
      });

      eBus.$on('popup', param => {
        this.popup.on = param.on;
        this.popup.type = param.type;
        this.popup.title = param.title;
        this.popup.contents = param.contents;
        this.popup.ok = param.ok;
        this.popup.cancel = param.cancel;
      })
    } else {
      this.$router.push({ path: '/' });
    }
  },
  methods: {
    handleBtnArea(e) {
      let style = 'position:fixed;display:flex;justify-content:center;align-items:flex-end;width:100%;bottom:0;height:20px;';
      this.visibleBtnArea =
        (e.type === 'mouseover' && e.target === this.$refs.btnArea) || e.type !== 'mouseover' && (e.target !== this.$refs.btnArea || e.target !== this.$refs.btn);
        // e.type !== 'mouseover' && (e.target !== this.$refs.mainVideo || e.target !== this.$refs.share || e.target.tagName !== 'video');
      this.$refs.btnArea.style = e.target !== this.$refs.mainVideo ? style + 'z-index:9' : style + 'z-index:11';
    },
    handlePopupOkBtnClick() {
      if (this.popup.ok) return this.popup.ok();
    },
    handlePopupCancelBtnClick() {
      this.popup.on = false;
      if (this.popup.cancel) return this.popup.cancel();
    },
    handleShareEndBtnClick() {
      console.log('공유 중지');
    },
    handleCollapseBtnClick() {
      this.isCollapsedVideo = !this.isCollapsedVideo;
    },
    setVideo(isLocal, id, stream) {
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
          isLocal
        })
      }
    },
    removeVideo() {
      if (id === 'screen') {

      } else {

      }
    },
    changeDisplay(isSharing, count) {
      if (isSharing) {
        // when started screen sharing
        document.getElementById('MainVideoContainer').appendChild(document.getElementById('MainVideo'));
        if (document.getElementById('local')) document.getElementById('local').classList.remove('local');
        // this.$refs.mainCont.appendChild(this.$refs.mainVideo);
      } else {
        // when stopped screen sharing
        if (document.getElementById('local') && count <= 2) document.getElementById('local').classList.add('local');
      }
    },
    setDisplay(count, id) {
      if (count > 2) {
        if (document.getElementById('local')) document.getElementById('local').classList.remove('local');
        this.videos.forEach((c, idx, arr) => {
          // 기존 1:1에서 나왔던 remote 영상 삭제
          if (c.id === 'remote') {
            this.$store.commit('removeStreamInfo', 'remote');
            arr.splice(idx, 1);
            // if (document.getElementById('remote')) {
            //   while (document.getElementById('remote').hasChildNodes()) {
            //     document.getElementById('remote').firstChild.srcObject = null;
            //     document.getElementById('remote').removeChild(document.getElementById('remote').firstChild);
            //   }
            // }
          }
        })
      }

      switch (count) {
        case 1: case 2:
					this.videoDisplayType = '';
					this.constraint.mWidth = 1280;
					this.constraint.mHeight = 720;
					break;

				case 3: case 4:
					this.videoDisplayType = 'four';
					this.constraint.mWidth = 960;
					this.constraint.mHeight = 540;
					break;

				case 5:	case 6:
					this.videoDisplayType = 'six';
					this.constraint.mWidth = 640;
					this.constraint.mHeight = 360;
					break;

				case 7: case 8: case 9:
					this.videoDisplayType = 'nine';
					this.constraint.mWidth = 640;
					this.constraint.mHeight = 360;
					break;

				case 10: case 11:	case 12:
					this.videoDisplayType = 'twelve';
					this.constraint.mWidth = 480;
					this.constraint.mHeight = 270;
					break;

				case 13: case 14: case 15: case 16:
					this.videoDisplayType = 'sixteen';
					this.constraint.mWidth = 320;
					this.constraint.mHeight = 180;
					break;

				default:
					console.warn(`ambiguous remain value`);
					this.videoDisplayType = 'sixteen';
					this.constraint.mWidth = 240;
					this.constraint.mHeight = 135;
					break;
      }
    }
  }
}
</script>
