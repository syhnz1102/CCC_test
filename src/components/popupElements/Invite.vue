<template>
  <div class="modalContent">
    <div class="invite">
      <div class="btn disalbed" @click="handleTalkBtnClick">
        <button class="talk" data-title="카카오톡"></button>
        <span>{{ this.$t('popup-invite-kakao') }}</span>
      </div>
      <div class="btn disalbed" @click="handleSMSBtnClick">
        <button class="message" data-title="문자메시지"></button>
        <span>{{ this.$t('popup-invite-mms') }}</span>
      </div>
      <div class="btn" @click="handleUrlCopyBtnClick">
        <button class="url" data-title="URL 복사"></button>
        <span>{{ this.$t('popup-invite-url') }}</span>
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
      let t = document.createElement("textarea");
      document.body.appendChild(t);
      t.value = `${window.location.href}

안드로이드는 크롬 브라우저, 아이폰은 사파리 브라우저에 본 URL을 복사하여 붙여 넣으시면 회의 방에 참석하실수 있습니다.
앱이 있는 경우 위 URL을 클릭하시면 앱으로 이동 되며, 자동으로 회의 방에 참석합니다.`;
      t.select();
      document.execCommand('copy');
      document.body.removeChild(t);

      eBus.$emit('toast', this.$t('popup-invite-url-complete'));
      // 200702 ivypark, v1.0.1. 버튼 클릭 시 팝업 종료
      eBus.$emit('popup', { on: false });
    },
    handleTalkBtnClick() {
      eBus.$emit('toast', this.$t('popup-invite-soon'));
    },
    handleSMSBtnClick() {
      eBus.$emit('toast', this.$t('popup-invite-soon'));
    }
  }
}
</script>
