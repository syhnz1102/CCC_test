<template>
  <div class="video" ref="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo, 'off': OffVideo }">
    <div class="userContainer">
      <div class="user">
        <span class="name" v-bind:class="{ 'micOff': offMic }">익명</span>
        <button v-if="id === 'local'" @click="handleChangeName">이름변경</button>
      </div>
    </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import { eBus } from '../commons/eventBus';

export default {
  props: { isLocal: Boolean, isOffVideo: Boolean, isOffMic: Boolean, vid: String },
  data() {
    return {
      isLocalVideo: this.isLocal,
      id: this.isLocal ? 'local' : this.vid,
      OffVideo: this.isOffVideo,
      offMic: this.isOffMic
    }
  },
  mounted() {
    let video = document.createElement('video');
    video.srcObject = this.$store.state.streamInfo[this.isLocalVideo ? 'local' : (this.$store.state.roomInfo.count === 2 ? 'remote' : this.id)];
    video.autoplay = true;
    video.muted = this.isLocalVideo;
    this.$refs.video.insertBefore(video, this.$refs.video.firstChild);
  },
  methods: {
    handleChangeName: () => {
      console.log('handleChangeName');
      eBus.$emit('popup', {
        on: true,
        type: 'ChangeName',
        title: '이름 변경',
        ok: () => {
          console.log('change name');
        }
      })
    }
  }
}
</script>
