<template>
  <div class="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo }">
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
  props: { isLocal: Boolean },
  data() {
    return {
      isLocalVideo: this.isLocal,
      id: this.isLocal ? 'local' : 'id'
    }
  },
  created() {
    eBus.$on('createVideo', _ => {
      let video = document.createElement('video');
      video.srcObject = _.stream;
      video.autoplay = true;
      this.isLocalVideo = _.isLocal;
      this.id = _.id;
      document.getElementById(_.isLocal ? 'local' : 'id').insertBefore(video, document.getElementById(_.isLocal ? 'local' : 'id').firstChild);
    })
  },
  methods: {
    handleChangeName: () => {
      console.log('handleChangeName')
    }
  }
}
</script>