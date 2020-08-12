import store from '../store';
import config from '../config';

class Utils {
  constructor() {

  }

  getPrivateUrl(cp) {

  }

  setPrivateInfo(cp) {
    if (config.privateMode.switch) {
      let payload = { cp };
      console.log(payload);
      if (config.privateMode.cpName !== cp) {
        // TODO: 200810 ivypark, 설정된 CP이름과 다를 경우 에러페이지 출력
        console.warn('settings is incorrect.');
      }

      store.commit('setUserInfo', payload);
    }
  }
}


export default new Utils();
