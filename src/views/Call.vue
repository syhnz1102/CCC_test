<template>
  <div class="wrapper">
    <div class="videoContainer">
        <div class="mainVideo">
          <template v-for="v in videos">
            <Video 
              :key="v.id"
              v-bind:isLocal="v.isLocal"
              v-bind:id="v.id" 
            />
          </template>
        </div>
    </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import Session from '../commons/session';
import { sendMessage } from '../commons/message';
import Video from '@/components/Video';
import { eBus } from '../commons/eventBus';

export default {
  components: { Video },
  data () {
    return {
      videos: [
        {
          id: 'local',
          isLocal: true
        }
      ],
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
    setVideo: (isLocal, id, stream) => {
      if (!this.videos || !Array.isArray(this.videos)) this.videos = [];
      this.videos.push({
        id: isLocal ? 'local' : id,
        isLocal
      })

      eBus.$emit('createVideo', {
        stream,
        isLocal
      });
    },
  }
}
</script>