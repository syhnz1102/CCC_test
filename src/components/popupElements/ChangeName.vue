<template>
  <div class="modalContent">
    <div class="userName">
      <div class="input">
        <input v-model="name" type="text" v-bind:placeholder="this.$t('popup-change-name-placeholder')" maxlength="8" v-on:keyup.enter="confirmed">
        <label></label>
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
import {sendMessage} from "../../commons/message";

export default {
  props: { ok: Function, cancel: Function, option: Object },
  data() {
    return {
      name: this.$store.state.userInfo.name
    }
  },
  methods: {
    confirmed() {
      if (!this.name) {
        eBus.$emit('toast', this.$t('popup-change-name-contents'));
        return;
      }
      this.$store.commit('setUserInfo', { name: this.name });
      this.ok({ id: this.$store.state.userInfo.id, name: this.name });
      eBus.$emit('toast', this.$t('popup-change-name-complete'));
      sendMessage('ChangeName', { userId: this.$store.state.userInfo.id, roomId: this.$store.state.roomInfo.roomId, name: this.name }, 'signalOp');
    }
  }
}
</script>
