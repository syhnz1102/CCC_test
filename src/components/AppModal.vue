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
      location.href = `Intent://kp.cococall#Intent;scheme=kpoint;package=kr.co.knowledgepoint.knowledgetalkccc;end`;
      mobile.setPlayBrowser(false);
    },
    handleClickMobileWebBtn() {
      mobile.setPlayBrowser(true);
      this.close();
    }
  }
}
</script>
