import io from 'socket.io-client';
import store from '../store';
import config from '../config';
import { onMessage } from './message';

class Session {
  socket = null;

  constructor() {
    console.debug('----------------- Opened Session -----------------')
    this.socket = io.connect(config.socketIoUrl[config.env], { reconnect: true, 'transports': ['websocket'] });
    this.socket.on('knowledgetalk', onMessage);
    store.commit('setSocketIo', this.socket);
  }
}

export default Session;
