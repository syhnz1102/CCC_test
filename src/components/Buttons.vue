<template>
  <div class="buttonContainer" v-if="isVisible">
      <div class="button">
        <button class="invite" @click="handleInviteBtn"><span>초대하기</span></button>
        <button class="share" @click="handleScreenShareBtn"><span>화면공유</span></button>
        <button class="camera" v-bind:class="{off: isCameraOff}" @click="handleCamBtn"><span>카메라</span></button>
        <button class="mic" v-bind:class="{off: isMicOff}" @click="handleMicBtn"><span>마이크</span></button>
        <button class="endCall" @click="handleEndCallBtn">통화종료</button>
      </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import screenShare from '../commons/screenshare';
import { eBus } from '../commons/eventBus';

export default {
  props: { isVisible: Boolean },
  data() {
    return {
      isCameraOff: false,
      isMicOff: false
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
      // console.log('===========>', this.$store.state.roomInfo.count);
      let s = this.$store.state;
      if (s.roomInfo.count <= 1 || s.streamInfo.share) {
        return alert('지금은 화면공유를 진행 할 수 없습니다.');
      }

      if (s.roomInfo.type === 'p2p') {
        let stream = await screenShare.createShareStream();
        await screenShare.createPeer('screen');
        await webRTC.createOffer('screen');
        eBus.$emit('share', {
          type: 'add',
          id: 'screen',
          isLocal: true,
          stream,
          count: s.roomInfo.count
        })
      }
    },
    handleCamBtn() {
      if (this.isCameraOff) {
      }
      this.isCameraOff = !this.isCameraOff
    },
    handleMicBtn() {
      if (this.isMicOff) {
      }
      this.isMicOff = !this.isMicOff
    },
    handleEndCallBtn() {
      webRTC.clear();
      this.$router.push({ path: '/' })
    }
  }
}
</script>
