import store from '../store';
import config from '../config';

class Utils {
  constructor() {

  }

  getPrivateUrl() {
    return `/${store.state.userInfo.cp ? store.state.userInfo.cp : ''}`;
  }

  setPrivateInfo(cp, ip) {
    if (config.privateMode.switch) {
      let payload = { cp };
      if (config.privateMode.cpName !== cp) {
        // TODO: 200810 ivypark, 설정된 CP이름과 다를 경우 에러페이지 출력
        console.warn('settings is incorrect.');
      }

      store.commit('setUserInfo', payload);
    }
  }
}


export default new Utils();
