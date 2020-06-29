<template>
  <div class="buttonContainer" v-if="isVisible">
      <div class="button wow animate__animated animate__fadeInUp animate__faster">
        <button class="invite" @click="handleInviteBtn"><span>초대하기</span></button>
        <button class="share" @click="handleScreenShareBtn"><span>화면공유</span></button>
        <button class="camera" v-bind:class="{off: isOffVideo}" @click="handleCamBtn"><span>카메라</span></button>
        <button class="mic" v-bind:class="{off: isOffMic}" @click="handleMicBtn"><span>마이크</span></button>
        <button class="endCall" @click="handleEndCallBtn">통화종료</button>
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
      isOffVideo: false,
      isOffMic: false
    }
  },
  mounted() {

  },
  methods: {
    handleInviteBtn() {
      eBus.$emit('popup', {
        on: true,
        type: 'Invite',
        title: '사용자 초대하기'
      })
    },
    async handleScreenShareBtn() {
      // 200623 ivypark, v1.0.0a 모바일 기기에서는 화면공유 block
      if (mobile.isMobile) {
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '화면 공유',
          contents: '모바일 기기에서는 화면공유를 진행할 수 없습니다.'
        })
      }

      let s = this.$store.state;
      if (s.roomInfo.count <= 1 || s.streamInfo.screen) {
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '화면 공유',
          contents: '지금은 화면 공유를 진행할 수 없습니다.'
        })
      }

      sendMessage('SessionReserve', { userId: s.userInfo.id, roomId: s.roomInfo.roomId })
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
    handleEndCallBtn() {
      // 200617 ivypark, v0.9.2. 통화 종료 팝업 추가
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
          // this.$router.push({ path: '/' })
          window.location.href = '/';
        }
      })
    }
  }
}
</script>
