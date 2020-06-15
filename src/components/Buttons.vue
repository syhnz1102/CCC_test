<template>
  <div class="buttonContainer" v-if="isVisible">
      <div class="button">
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
      let s = this.$store.state;
      if (s.roomInfo.count <= 1 || s.streamInfo.screen) {
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '화면 공유',
          contents: '지금은 화면 공유를 진행할 수 없습니다.'
        })
      }

      sendMessage('SessionReserve', { userId: s.userInfo, roomId: s.roomInfo.roomId })
    },
    handleCamBtn() {
      this.isOffVideo = !this.isOffVideo;

      let s = this.$store.state;
      sendMessage('SetVideo', { userId: s.userInfo, roomId: s.roomInfo.roomId, status: this.isOffVideo }, 'signalOp');

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
      sendMessage('SetAudio', { userId: s.userInfo, roomId: s.roomInfo.roomId, status: this.isOffMic }, 'signalOp');

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
      webRTC.clear();
      eBus.$emit('video', {
        type: 'remove'
      })
      this.$router.push({ path: '/' })
    }
  }
}
</script>
