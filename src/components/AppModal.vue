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
        //deeplink
        // location.href = `kp.cococall://roomjoin${window.location.href.indexOf('/room/') > -1 ? `?roomid=${window.location.href.split('/room/')[1]}` : ``}`;

        //universal link
        location.href = `https://cococall.net/ios_ulink/roomjoin${window.location.href.indexOf('/room/') > -1 ? `?roomid=${window.location.href.split('/room/')[1]}` : ``}`;
        mobile.setPlayBrowser(false);
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
