<template>
  <div class="wrapper">
    <div class="videoContainer">
      <div class="mainVideo" ref="mainVideo" @mouseover="handleBtnArea">
        <template v-for="v in videos">
          <Video 
            :key="v.id"
            v-bind:isLocal="v.isLocal"
            v-bind:vid="v.id" 
          />
        </template>
      </div>
    </div>
    <!-- <div ref="btnArea" @mouseover="handleBtnArea" style="position:fixed;display:flex;justify-content:center;align-items:flex-end;width:50%;bottom:0;height:200px;z-index:11"></div> -->
    <Buttons v-if="visible" class="wow animate__animated animate__fadeInUp animate__faster" />
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';
import { sendMessage } from '../commons/message';
import webRTC from '../commons/webrtc';
import Session from '../commons/session';

import Video from '@/components/Video';
import Buttons from '@/components/Buttons';

export default {
  components: { Video, Buttons },
  data () {
    return {
      videos: [],
      visible: false
    }
  },
  async created() {
    if (await webRTC.checkMediaDevices()) {
      if (!this.$store.state.socket) new Session();
      sendMessage('CCC-Join', { roomId: 'abcdefg' })

      eBus.$on('addVideo', param => {
        this.setVideo(param.isLocal, param.id, param.stream);
      });

      let stream = await webRTC.createVideoStream();
      this.setVideo(true, 'local', stream);
    } else {
      this.$router.push({ path: '/' });
    }
  },
  methods: {
    setVideo(isLocal, id, stream) {
      this.videos.push({
        id: isLocal ? 'local' : id,
        isLocal
      })
    },
    handleBtnArea(e) {
      // let style = 'position:fixed;display:flex;justify-content:center;align-items:flex-end;width:50%;bottom:0;height:200px;';
      // this.visible = e.target !== this.$refs.mainVideo;
      // this.$refs.btnArea.style = e.target !== this.$refs.mainVideo ? style + 'z-index:9' : style + 'z-index:11';
    }
  }
}
</script>