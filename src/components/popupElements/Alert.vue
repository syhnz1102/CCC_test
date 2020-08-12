<template>
  <div class="modalContent">
    <p>{{ contents }}</p>
    <div class="button">
      <button class="submit" @click="cancel">{{ this.$t('popup-submit') }}</button>
    </div>
  </div>
</template>

<script>
  export default {
    props: { contents: String, cancel: Function }
  }
</script>
