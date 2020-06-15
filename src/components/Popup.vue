<template>
  <div class="modal">
    <div class="toast wow animate__animated animate__fadeOut" v-if="toast">
      <p>{{ toast }}</p>
    </div>
    <div class="modalContainer">
      <div class="modalHeader">
        <span class="invite">{{ pTitle }}</span>
        <button @click="cancelBtnClick">닫기</button>
      </div>
      <ChangeName v-if="contentsType === 'ChangeName'" v-bind:ok="okBtnClick" v-bind:cancel="cancelBtnClick" />
      <Confirm v-if="contentsType === 'Confirm'" v-bind:ok="okBtnClick" v-bind:cancel="cancelBtnClick" v-bind:contents="pContents" />
      <Alert v-if="contentsType === 'Alert'" v-bind:cancel="cancelBtnClick" v-bind:contents="pContents" />
      <Invite v-if="contentsType === 'Invite'"/>
    </div>
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';

import ChangeName from './popupElements/ChangeName';
import Confirm from './popupElements/Confirm';
import Invite from './popupElements/Invite';
import Alert from './popupElements/Alert';

export default {
  props: { type: String, title: String, contents: String, ok: Function, cancel: Function },
  components: { ChangeName, Confirm, Invite, Alert },
  data() {
    return {
      contentsType: this.type,
      pTitle: this.title,
      pContents: this.contents,
      okBtnClick: this.ok,
      cancelBtnClick: this.cancel,
      toast: ''
    }
  },
  mounted() {
    eBus.$on('toast', (content) => {
      this.emitToast(content)
    })
  },
  methods: {
    emitToast(content) {
      this.toast = content;
      setTimeout(() => {
        this.toast = '';
      }, 1000)
    }
  }
}
</script>
