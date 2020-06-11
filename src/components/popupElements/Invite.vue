<template>
  <div class="modalContent">
    <div class="invite">
      <div class="btn disalbed" @click="handleTalkBtnClick">
        <button class="talk" data-title="카카오톡"></button>
        <span>카카오톡</span>
      </div>
      <div class="btn disalbed" @click="handleSMSBtnClick">
        <button class="message" data-title="문자메시지"></button>
        <span>문자메시지</span>
      </div>
      <div class="btn" @click="handleUrlCopyBtnClick">
        <button class="url" data-title="URL 복사"></button>
        <span>URL 복사</span>
      </div>
    </div>
  </div>
</template>

<script>
import { eBus } from '../../commons/eventBus';

export default {
  data() {
    return {
      
    }
  },
  methods: {
    handleUrlCopyBtnClick() {
      var t = document.createElement("textarea");
      document.body.appendChild(t);
      t.value = window.location.href;
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);

      eBus.$emit('toast');
    },
    handleTalkBtnClick() {
      alert('현재 준비중인 기능입니다.');
    },
    handleSMSBtnClick() {
      alert('현재 준비중인 기능입니다.');
    }
  }
}
</script>