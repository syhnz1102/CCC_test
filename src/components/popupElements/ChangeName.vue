<template>
  <div class="modalContent">
    <div class="userName">
      <div class="input">
        <input v-model="name" type="text" placeholder="이름을 입력하세요." maxlength="8" v-on:keyup.enter="confirmed">
        <label></label>
      </div>
    </div>
    <div class="button">
      <button class="submit" @click="confirmed">확인</button>
      <button class="cancel" @click="this.cancel">취소</button>
    </div>
  </div>
</template>

<script>
import { eBus } from "../../commons/eventBus";

export default {
  props: { ok: Function, cancel: Function },
  data() {
    return {
      name: this.$store.state.userInfo.name
    }
  },
  methods: {
    confirmed() {
      if (!this.name) {
        eBus.$emit('toast', '이름을 입력하세요.');
        return;
      }
      this.$store.commit('setUserInfo', { name: this.name });
      this.ok({ id: this.$store.state.userInfo.id, name: this.name });
      eBus.$emit('toast', '이름이 변경 되었습니다.');
    }
  }
}
</script>
