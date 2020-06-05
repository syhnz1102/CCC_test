<template>
  <div class="video" ref="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo }">
    <div class="userContainer">
      <div class="user" @click="handleChangeName">
        <span class="name micOff">익명</span>
        <button>이름변경</button>
      </div>
    </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import { eBus } from '../commons/eventBus';

export default {
  props: { isLocal: Boolean, vid: String },
  data() {
    return {
      isLocalVideo: this.isLocal,
      id: this.isLocal ? 'local' : this.vid,
    }
  },
  mounted() {
    let video = document.createElement('video');
    video.srcObject = this.$store.state.streamInfo[this.isLocalVideo ? 'local' : (this.$store.state.roomInfo.count === 2 ? 'remote' : this.id)];
    video.autoplay = true;
    video.muted = this.isLocalVideo;
    this.$refs.video.insertBefore(video, this.$refs.video.firstChild);
    console.log(this.$store.state);
  },
  methods: {
    handleChangeName: () => {
      console.log('handleChangeName')
    }
  }
}
</script>