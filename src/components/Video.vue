<template>
  <div class="video" ref="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo, 'camOff': offVideo }">
    <div class="userContainer">
      <div class="user">
        <span class="name" v-bind:class="{ 'micOff': offMic }">{{ name }}</span>
        <button v-if="id === 'local'" @click="handleChangeName">이름변경</button>
      </div>
    </div>
  </div>
</template>

<script>
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
    if (!this.isOffVideo) this.attachVideo();
    eBus.$on('setVideo', param => {
      // 200618 ivypark, v0.9.2. 1:1 공유 중 cam/mic off 시 로컬화면이 분리되는 현상 수정
      this.isLocalVideo = this.id === 'local' && this.$store.state.roomInfo.count <= 2 && !this.$store.state.streamInfo.screen;
      if (param.id === this.id && param.hasOwnProperty('name')) this.name = param.name;
      if (param.id === this.id && param.hasOwnProperty('isOffMic')) this.offMic = param.isOffMic;
      if (param.id === this.id && param.hasOwnProperty('isOffVideo')) {
        // 200702 ivypark, v1.0.1. 비디오 off 시 소리 들리지 않는 현상 수정. (기존 비디오 삭제 -> display: none, block으로 변경되도록 수정)
        this.$refs.video.querySelector('video').style = param.isOffVideo ? `display: none` : `display: block`;
        // this.$refs.video.querySelector('video').remove() : this.attachVideo();
        this.offVideo = param.isOffVideo;
      }
      if (param.id === this.id && param.hasOwnProperty('deviceSetting')) {
        console.log(param.deviceSetting);
        this.$refs.video.querySelector('video').muted = true;
        if (param.deviceSetting.stream) {
          console.log(param.deviceSetting.stream.getAudioTracks());
          console.log('1 ', this.$refs.video.querySelector('video').srcObject)
          this.$refs.video.querySelector('video').srcObject = null;
          console.log('2 ', this.$refs.video.querySelector('video').srcObject)
          this.$refs.video.querySelector('video').srcObject = param.deviceSetting.stream;
          console.log('3 ', this.$refs.video.querySelector('video').srcObject)
          this.$refs.video.querySelector('video').play();
        }
        if (param.deviceSetting.hasOwnProperty('done')) this.$refs.video.querySelector('video').muted = param.deviceSetting.done;
      }
    })
  },
  methods: {
    attachVideo() {
      let video = document.createElement('video');
      video.srcObject = this.$store.state.streamInfo[this.isLocalVideo ? 'local' : (this.$store.state.roomInfo.type === 'p2p' ? 'remote' : this.id)];
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
