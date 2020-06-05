<template>
  <div class="buttonContainer">
      <div class="button">
        <button class="invite" @click="handleInviteBtn"><span>초대하기</span></button>
        <button class="share" @click="handleScreenShareBtn"><span>화면공유</span></button>
        <button class="camera" @click="handleCamBtn"><span>카메라</span></button>
        <!-- <button class="camera off"><span>카메라</span></button> -->
        <button class="mic" @click="handleMicBtn"><span>마이크</span></button>
        <!-- <button class="mic off"><span>마이크</span></button> -->
        <button class="endCall" @click="handleEndCallBtn">통화종료</button>
      </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';

export default {
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    handleInviteBtn() {
      alert('준비중 입니다.');
    },
    handleScreenShareBtn() {
      alert('준비중 입니다.');
    },
    handleCamBtn() {
      alert('준비중 입니다.');
    },
    handleMicBtn() {
      alert('준비중 입니다.');
    },
    handleEndCallBtn() {
      webRTC.clear();
      this.$router.push({ path: '/' })
    }
  }
}
</script>