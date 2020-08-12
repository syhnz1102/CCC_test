<template>
  <div class="modalContent">
    <p>{{ contents }}</p>
    <div class="button">
        <button class="submit" @click="ok">{{ this.$t('popup-submit') }}</button>
        <button class="cancel" @click="cancel">{{ this.$t('popup-cancel') }}</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: { contents: String, ok: Function, cancel: Function }
  }
</script>
