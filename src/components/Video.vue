<template>
  <div class="video" ref="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo, 'off': offVideo }">
    <div class="userContainer">
      <div class="user">
        <span class="name" v-bind:class="{ 'micOff': offMic }">{{ name }}</span>
        <button v-if="id === 'local'" @click="handleChangeName">이름변경</button>
      </div>
    </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import { eBus } from '../commons/eventBus';

export default {
  props: { isLocal: Boolean, isOffVideo: Boolean, isOffMic: Boolean, vid: String, userName: String },
  data() {
    return {
      isLocalVideo: this.isLocal,
      id: this.isLocal ? 'local' : this.vid,
      name: this.userName,
      offVideo: this.isOffVideo,
      offMic: this.isOffMic
    }
  },
  mounted() {
    this.attachVideo();
    eBus.$on('setVideo', param => {
      // 200618 ivypark, v0.9.2. 1:1 공유 중 cam/mic off 시 로컬화면이 분리되는 현상 수정
      this.isLocalVideo = this.id === 'local' && this.$store.state.roomInfo.count <= 2 && this.$store.state.streamInfo.share;
      if (param.id === this.id && param.hasOwnProperty('name')) this.name = param.name;
      if (param.id === this.id && param.hasOwnProperty('isOffMic')) this.offMic = param.isOffMic;
      if (param.id === this.id && param.hasOwnProperty('isOffVideo')) {
        param.isOffVideo ? this.$refs.video.querySelector('video').remove() : this.attachVideo();
        this.offVideo = param.isOffVideo;
      }
    })
  },
  methods: {
    attachVideo() {
      let video = document.createElement('video');
      video.srcObject = this.$store.state.streamInfo[this.isLocalVideo ? 'local' : (this.$store.state.roomInfo.count === 2 ? 'remote' : this.id)];
      video.autoplay = true;
      video.muted = this.isLocalVideo;
      if (this.$refs.video.firstChild) this.$refs.video.insertBefore(video, this.$refs.video.firstChild);
    },
    handleChangeName() {
      eBus.$emit('popup', {
        on: true,
        type: 'ChangeName',
        title: '이름 변경',
        ok: (param) => {
          this.name = param.name;
        }
      })
    }
  }
}
</script>
