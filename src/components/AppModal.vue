<template>
  <div class="recommendAppModal">
    <div class="container">
      <div class="content">
        <div class="logo">COCOcall</div>
        <p>COCOcall을<br /> APP으로 만나보세요!</p>
        <div class="icon"></div>
      </div>
      <div class="button">
        <button @click="handleClickAppBtn">COCOcall 앱으로 이동</button>
        <a @click="handleClickMobileWebBtn">괜찮아요. 모바일웹으로 이용할게요.</a>
      </div>
    </div>
  </div>
</template>

<script>
import mobile from "../commons/mobile";
import { eBus } from "../commons/eventBus";

export default {
  props: { close: Function },
  components: { },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    handleClickAppBtn() {
      if (mobile.isSafari) {
        // iOS 실행의 경우
        this.close();
        mobile.setPlayBrowser(true);
        eBus.$emit('popup-main', {
          on: true,
          type: 'Alert',
          title: '앱 사용 실패',
          contents: 'iOS App은 현재 준비 중입니다. \n확인 버튼을 누르시면 웹 브라우저로 계속 됩니다.'
        })
      } else {
        location.href = `Intent://kp.cococall${window.location.href.indexOf('/room/') > -1 ? `?roomid=${window.location.href.split('/room/')[1]}` : ``}#Intent;scheme=kpoint;package=kr.co.knowledgepoint.knowledgetalkccc;end`;
        mobile.setPlayBrowser(false);
      }
    },
    handleClickMobileWebBtn() {
      this.close();
      mobile.setPlayBrowser(true);
    }
  }
}
</script>
