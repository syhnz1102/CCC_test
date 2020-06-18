<template>
  <div class="modal">
    <div class="toast wow animate__animated animate__fadeOut" data-wow-duration="3s" v-if="toast">
      <p>{{ toast }}</p>
    </div>
    <div class="modalContainer">
      <div class="modalHeader">
        <span v-bind:class="{invite: contentsType === 'Invite'}">{{ pTitle }}</span>
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
      toast: '',
      timeout: null
    }
  },
  mounted() {
    eBus.$on('toast', (content) => {
      this.emitToast(content)
    })
  },
  methods: {
    emitToast(content) {
      clearTimeout(this.timeout);
      this.toast = content;
      // 200617 ivypark, v0.9.2. 토스트 팝업 출력 3초로 변경
      this.timeout = setTimeout(() => {
        this.toast = '';
      }, 3000)
    }
  }
}
</script>
