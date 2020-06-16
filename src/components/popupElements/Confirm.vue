<template>
  <div class="modalContent">
    <p>{{ contents }}</p>
    <div class="button">
        <button class="submit" @click="ok">확인</button>
        <button class="cancel" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: { contents: String, ok: Function, cancel: Function }
  }
</script>
