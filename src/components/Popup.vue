<template>
  <div class="modal">
    <div class="toast wow animate__animated animate__fadeOut" v-if="isEmitToast">
      <p>URL이 복사되었습니다.</p>
    </div>
    <div class="modalContainer">
      <div class="modalHeader">
        <span class="invite">{{ pTitle }}</span>
        <button @click="cancelBtnClick">닫기</button>
      </div>
      <ChangeName v-if="contentsType === 'ChangeName'" v-bind:ok="okBtnClick" v-bind:cancel="cancelBtnClick" />
      <Confirm v-if="contentsType === 'Confirm'" v-bind:ok="okBtnClick" v-bind:cancel="cancelBtnClick" v-bind:contents="pContents" />
      <Invite v-if="contentsType === 'Invite'"/>
    </div>
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';

import ChangeName from './popupElements/ChangeName';
import Confirm from './popupElements/Confirm';
import Invite from './popupElements/Invite';

export default {
  props: { type: String, title: String, contents: String, ok: Function, cancel: Function },
  components: { ChangeName, Confirm, Invite },
  data() {
    return {
      contentsType: this.type,
      pTitle: this.title,
      pContents: this.contents,
      okBtnClick: this.ok,
      cancelBtnClick: this.cancel,
      isEmitToast: false
    }
  },
  mounted() {
    eBus.$on('toast', () => {
      this.emitToast()
    })
  },
  methods: {
    emitToast() {
      this.isEmitToast = true;
      setTimeout(() => {
        this.isEmitToast = false;
      }, 1000)
    }
  }
}
</script>