<template>
  <div class="mainContainer" id="MainContainer">
      <div class="mainContent">
          <div class="mainTitle">
          </div>
          <div class="mainButton">
              <button @click="handleBtnClick">회의방 생성</button>
              <button @click="tempHandleBtnClickTest">회의방 참여</button>
          </div>
      </div>
  </div>
</template>

<script>
import webRTC from '../commons/webrtc';
import Session from '../commons/session';
import { sendMessage } from '../commons/message';

export default {
  data () {
    return {
      
    }
  },
  methods: {
    async handleBtnClick() {
      new Session();
      sendMessage('CCC-CreateRoom', { foo: 'bar' });

      this.$router.push({ path: '/rooms' })
    },
    tempHandleBtnClickTest() {
      this.$router.push({ path: '/rooms' })
    }
  }
}
</script>