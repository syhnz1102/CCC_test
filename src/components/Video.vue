<template>
  <div class="video" ref="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo, 'camOff': offVideo, 'speaker': this.isTalking }">
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
      offMic: this.isOffMic,
      isTalking: false
    }
  },
  mounted() {
    this.attachVideo(this.isOffVideo);
    // if (!this.isOffVideo) this.attachVideo();
    eBus.$on('setVideo', async param => {
      console.log(param);
      // 200618 ivypark, v0.9.2. 1:1 공유 중 cam/mic off 시 로컬화면이 분리되는 현상 수정
      this.isLocalVideo = this.id === 'local' && (!this.$store.state.roomInfo.count || this.$store.state.roomInfo.count <= 2) && !this.$store.state.streamInfo.screen;
      console.log(this.isLocalVideo, this.$store.state.roomInfo.count);

      if (param.id === this.id && param.hasOwnProperty('name')) this.name = param.name;
      if (param.id === this.id && param.hasOwnProperty('isTalking')) this.isTalking = param.isTalking;
      if (param.id === this.id && param.hasOwnProperty('isOffMic')) this.offMic = param.isOffMic;
      if (param.id === this.id && param.hasOwnProperty('isOffVideo')) {
        // 200702 ivypark, v1.0.1. 비디오 off 시 소리 들리지 않는 현상 수정. (기존 비디오 삭제 -> display: none, block으로 변경되도록 수정)
        this.$refs.video.querySelector('video').style = param.isOffVideo ? `display: none` : `display: block`;
        // this.$refs.video.querySelector('video').remove() : this.attachVideo();
        this.offVideo = param.isOffVideo;
      }
      if (param.id === this.id && param.hasOwnProperty('deviceSetting')) {
        this.$refs.video.querySelector('video').muted = true;
        if (param.deviceSetting.stream) {
          this.$refs.video.querySelector('video').srcObject = null;
          this.$refs.video.querySelector('video').srcObject = param.deviceSetting.stream;
          await this.$refs.video.querySelector('video').play();
        }
        if (param.deviceSetting.hasOwnProperty('done')) this.$refs.video.querySelector('video').muted = param.deviceSetting.done;
        if (param.deviceSetting.hasOwnProperty('sinkId')) await this.$refs.video.querySelector('video').setSinkId(param.deviceSetting.sinkId);
      }
    })
  },
  methods: {
    attachVideo(isOff) {
      let video = document.createElement('video');
      video.srcObject = this.$store.state.streamInfo[this.isLocalVideo ? 'local' : (this.$store.state.roomInfo.type === 'p2p' ? 'remote' : this.id)];
      video.autoplay = true;
      video.muted = this.isLocalVideo;
      video.playsInline = true;
      if (this.$refs.video.firstChild) this.$refs.video.insertBefore(video, this.$refs.video.firstChild);
      // 200714 ivypark, v1.0.7. 화면 off후 신규 참가자 입장 시 카메라 화면이 출력되지 않는 문제 수정
      this.$refs.video.querySelector('video').style = isOff ? `display: none` : `display: block`;
    },
    handleChangeName() {
      eBus.$emit('popup', {
        on: true,
        type: 'ChangeName',
        title: this.$t('popup-change-name-title'),
        ok: (param) => {
          this.name = param.name;
        }
      })
    }
  }
}
</script>
