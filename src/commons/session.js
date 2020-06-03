import io from 'socket.io-client';
import { on } from './message';
import store from '../store';

class Session {
  socket = null;

  constructor() {
    console.debug('----------------- Opened Session -----------------')
    this.socket = io.connect('https://localhost:7101/SignalServer', {});
    this.socket.on('knowledgetalk', on);
    store.commit('setSocketIo', this.socket);
  }
}

export default Session;