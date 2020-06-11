<template>
  <div class="modalContent">
    <div class="userName">
      <div class="input">
        <input type="text" placeholder="익명">
        <label></label>
      </div>
    </div>
    <div class="button">
      <button class="submit" @click="this.ok">확인</button>
      <button class="cancel" @click="this.cancel">취소</button>
    </div>
  </div>
</template>

<script>
export default {
  props: { ok: Function, cancel: Function },
  data() {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>