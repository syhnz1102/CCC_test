<template>
  <div class="buttonContainer" v-if="isVisible">
      <div class="button wow animate__animated animate__fadeInUp animate__faster">
        <ul>
          <li><button class="invite" @click="handleInviteBtn"><span>{{ this.$t('button-invite') }}</span></button></li>
        	<li><button class="share" @click="handleScreenShareBtn"><span>{{ this.$t('button-share') }}</span></button></li>
        	<li><button class="camera" v-bind:class="{off: isOffVideo}" @click="handleCamBtn"><span>{{ this.$t('button-camera') }}</span></button></li>
        	<li><button class="mic" v-bind:class="{off: isOffMic}" @click="handleMicBtn"><span>{{ this.$t('button-microphone') }}</span></button></li>
        	<li>
        		<button class="more" @click="function(){showsMore = !showsMore}"><span>{{ this.$t('button-more') }}</span></button> 
		        <div class="dropdown" v-if="showsMore">
        	    <ul>
                <li><button class="enter" v-if="!isMobile" @click="handleJoinBtn"><span>{{ this.$t('button-another-meeting') }}</span></button></li>
        	    </ul>
		          <ul>
                <li><button class="talking" @click="handleTalkingBtn"><span>{{ btnStrTalking }}</span></button></li>
                <li><button class="bgBlur" @click="handleBgBlurBtn"><span>{{ this.$t('button-bg-blur-on') }}</span></button></li>
		          </ul>
		          <ul>
                <li><button class="setting" v-if="!isMobile" @click="handleSettingBtn"><span>{{ this.$t('button-setting') }}</span></button></li>
		          </ul>
		        </div>
		      </li>
        	<li><button class="endCall" @click="handleEndCallBtn">{{ this.$t('button-end-call') }}</button></li>
      	</ul>
      </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import mobile from "../commons/mobile";
import { sendMessage } from '../commons/message';
import { eBus } from '../commons/eventBus';

export default {
  props: { isVisible: Boolean },
  data() {
    return {
      isWebView: mobile.isWebView,
      isMobile: mobile.isMobile,
      isOffVideo: false,
      isOffMic: false,
      showsSpeaker: false,
      isBgBlur: false,
      showsMore : false,
      btnStrTalking : this.showsSpeaker ? this.$t('button-shows-speaker-off') : this.$t('button-shows-speaker-on')
    }
  },
  mounted() {

},
  updated() {
    // buttonContainer invisible 되면 더보기 dropbox도 invisible 되도록
    if (!this.isVisible) this.showsMore = false;
  },
  methods: {
    handleJoinBtn() {
      eBus.$emit('popup', {
        on: true,
        type: 'Join', 
        title: this.$t('popup-another-meeting-title')
      })
    },
    handleInviteBtn() {
      eBus.$emit('popup', {
        on: true,
        type: 'Invite',
        title: this.$t('popup-invite-title')
      })
    },
    async handleScreenShareBtn() {
      // 200623 ivypark, v1.0.0a 모바일 기기에서는 화면공유 block
      if (mobile.isMobile) {
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: this.$t('popup-screen-share-title'),
          contents: this.$t('popup-screen-share-contents-failed-2')
        })
      }

      let s = this.$store.state;
      if (s.roomInfo.count <= 1 || s.streamInfo.screen) {
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: this.$t('popup-screen-share-title'),
          contents: this.$t('popup-screen-share-contents-failed-1')
        })
      } else {
        sendMessage('SessionReserve', { userId: s.userInfo.id, roomId: s.roomInfo.roomId })
      }
    },
    handleCamBtn() {
      this.isOffVideo = !this.isOffVideo;

      let s = this.$store.state;
      sendMessage('SetVideo', { userId: s.userInfo.id, roomId: s.roomInfo.roomId, status: this.isOffVideo }, 'signalOp');

      eBus.$emit('video', {
        type: 'set',
        id: 'local',
        isOffVideo: this.isOffVideo
      })

      if (s.streamInfo.local) {
        const tracks = s.streamInfo.local.getTracks();
        tracks.forEach(curr => {
          if (curr.kind === 'video') {
            curr.enabled = !this.isOffVideo;
          }
        });
      }
    },
    handleMicBtn() {
      this.isOffMic = !this.isOffMic;

      let s = this.$store.state;
      sendMessage('SetAudio', { userId: s.userInfo.id, roomId: s.roomInfo.roomId, status: this.isOffMic }, 'signalOp');

      eBus.$emit('video', {
        type: 'set',
        id: 'local',
        isOffMic: this.isOffMic
      })

      if (s.streamInfo.local) {
        const tracks = s.streamInfo.local.getTracks();
        tracks.forEach(curr => {
          if (curr.kind === 'audio') {
            curr.enabled = !this.isOffMic;
          }
        });
      }
    },
    handleTalkingBtn(){
      //2명 이하 팝업추가
      console.log('@@@@' + this.$store.state.roomInfo.count);
      if (this.$store.state.roomInfo.count<3) {
        eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '화자 감지',
          contents: '사용자가 3명 이상일 때 사용 가능합니다.'
        });
        return;
      }
      this.showsSpeaker = !this.showsSpeaker;
      this.$store.commit('setShowsSpeaker', this.showsSpeaker);
      if (this.showsSpeaker === false) {
        eBus.$emit('setVideo', {
          showsSpeaker : false
        });
      }
      this.btnStrTalking = this.showsSpeaker ? this.$t('button-shows-speaker-off') : this.$t('button-shows-speaker-on');
    },
    handleBgBlurBtn(){
      eBus.$emit('popup', {
        on: true,
        type: 'Alert',
        title: '사생활 보호',
        contents: '현재 준비 중인 기능입니다.'
      });
    },
    handleSettingBtn() {
      // 200706 ivypark, v1.0.3. 디바이스 세팅 팝업 추가
      eBus.$emit('popup', {
        on: true,
        type: 'Settings',
        title: this.$t('popup-setting-devices-title'),
        contents: this.$t('popup-setting-devices-contents-2'),
        option: { inCall: true },
        ok: () => {
          eBus.$emit('setVideo', {
            type: 'set',
            id: 'local',
            deviceSetting: {
              done: true
            }
          });
        },
        cancel: () => {
          // 200715 ivypark, v1.0.7. 디바이스 설정 팝업에서 X 버튼 누를 시 본인의 목소리가 나오던 문제 수정
          eBus.$emit('setVideo', {
            type: 'set',
            id: 'local',
            deviceSetting: {
              done: true
            }
          });
        }
      })
    },
    handleEndCallBtn() {
      // 200617 ivypark, v0.9.2. 통화 종료 팝업 추가
      eBus.$emit('popup', {
        on: true,
        type: 'Confirm',
        title: this.$t('popup-end-call-title'),
        contents: this.$t('popup-end-call-contents'),
        ok: () => {
          sendMessage('ExitRoom', { roomId: window.location.href.split('/room/')[1] });
          webRTC.clear();
          eBus.$emit('video', { type: 'remove' });
          // eBus.$emit('popup', { on: false });
          // this.$router.push({ path: '/' })
          window.location.href = '/';
        }
      })
    }
  }
}
</script>

