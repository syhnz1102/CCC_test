<template>
  <div class="modalContent">
    <div class="enterCall">
      <div class="input">
        <input v-model='url' type="text" v-bind:placeholder="this.$t('popup-another-meeting-placeholder')" v-on:keyup.enter="confirmed">
<!--        <label>다른 회의 참여</label>-->
      </div>
    </div>
    <div class="button">
      <button class="submit" @click="confirmed">{{ this.$t('popup-submit') }}</button>
      <button class="cancel" @click="this.cancel">{{ this.$t('popup-cancel') }}</button>
    </div>
  </div>
</template>

<script>
import { eBus } from "../../commons/eventBus";
import config from "../../config";
import mobile from "../../commons/mobile";
import webRTC from "../../commons/webrtc";

export default {
  props: { ok: Function, cancel: Function },
  data() {
    return {
      url: ''
    }
  },
  methods: {
    confirmed() {
      // 200709 ivypark, v1.0.5. 회의 참여 버튼 추가
      if (!this.url) {
        eBus.$emit('toast', `참여 하실 URL 또는 방 번호(${config.lengthOfRoomId}자리)를 입력하세요.`);
        return false;
      } else {
        if (this.url.indexOf('https://') === 0 && this.url.indexOf('/room/') > -1) {
          // URL을 입력 한 경우
          let domain = this.url.split('/')[2];
          let roomId = this.url.split('/')[4];
          if (config.listOfDomains.some(c => domain.indexOf(c) > -1) && Number(roomId) && roomId.length === config.lengthOfRoomId) {
            eBus.$emit('toast', '잠시 후 다른 회의 방으로 이동합니다.');
            this.ok();

            setTimeout(() => {
              webRTC.clear();
              if (mobile.isMobile) {
                mobile.onStartConference(roomId);
              } else {
                window.location.href = `/room/${roomId}`;
              }
            }, 1000);
          } else {
            eBus.$emit('toast', '전달 받은 URL 또는 번호를 정확히 입력해주세요.');
          }
        } else {
          // Room 번호만 입력 한 경우
          if (Number(this.url) && this.url.length === config.lengthOfRoomId) {
            eBus.$emit('toast', '잠시 후 다른 회의 방으로 이동합니다.');
            this.ok();

            setTimeout(() => {
              webRTC.clear();
              if (mobile.isMobile) {
                mobile.onStartConference(this.url);
              } else {
                window.location.href = `/room/${this.url}`;
              }
            }, 1000);
          } else {
            eBus.$emit('toast', '전달 받은 URL 또는 번호를 정확히 입력해주세요.');
          }
        }
      }
    }
  }
}
</script>
