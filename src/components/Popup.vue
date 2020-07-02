<template>
  <div class="modal">
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
      timeout: null
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
