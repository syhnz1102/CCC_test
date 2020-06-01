<template>
  <div class="mainContainer" id="MainContainer">
      <div class="mainContent">
          <div class="mainTitle">
          </div>
          <div class="mainButton">
              <button @click="handleBtnClick">회의방 생성</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  methods: {
    async handleBtnClick() {
      let a = await this.checkMediaDevices();
      console.log('=============> ', a)
      // this.$router.push({ path:'/rooms' })
    },
    checkMediaDevices() {
      return new Promise(resolve => {
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            console.debug('enumerateDevices : ', devices);
            let cam = devices.some(elem => elem.kind === 'videoinput');
            let mic = devices.some(elem => elem.kind === 'audioinput2');
            // self.setLocalMediaConstraintOptions(cam ? undefined : false, !!mic);
            if (!cam && !mic) {
              resolve(confirm(`모든 카메라, 마이크 장치가 인식되지 않습니다.\n회의실에 입장 하시겠습니까?`));
            } else if (!cam || !mic) {
              resolve(confirm(`${!cam ? '카메라' : '마이크'} 장치가 인식되지 않습니다.\n회의실에 입장 하시겠습니까?`));
            } else {
              resolve(true);
            }
          })
          .catch(e => {
            console.error('## devices are not found: ', e);
            self.setLocalMediaConstraintOptions(false, false);
            popup.on(`카메라, 마이크 장치가 인식되지 않습니다.\n 카메라와 마이크 중 한 개 이상의 장치가 필요합니다.`);
            resolve(false);
          });
      });
    }
  }
}
</script>