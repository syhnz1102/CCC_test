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
import screenShare from '../commons/screenshare';
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
        return alert('지금은 화면공유를 진행 할 수 없습니다.');
      }

      sendMessage('SessionReserve', { userId: s.userInfo, roomId: s.roomInfo.roomId })
    },
    handleCamBtn() {
      this.isOffVideo = !this.isOffVideo;
      eBus.$emit('video', {
        type: 'set',
        id: 'local',
        isOffVideo: this.isOffVideo
      })
    },
    handleMicBtn() {
      this.isOffMic = !this.isOffMic;
      eBus.$emit('video', {
        type: 'set',
        id: 'local',
        isOffMic: this.isOffMic
      })
    },
    handleEndCallBtn() {
      webRTC.clear();
      this.$router.push({ path: '/' })
    }
  }
}
</script>
