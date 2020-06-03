import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: null,
    peerInfo: {},
    streamInfo: {},
    roomInfo: {},
    video: []
  },
  mutations: {
    setSocketIo(state, socket) {
      state.socket = socket;
    },
    setPeerInfo(state, peer) {
      Object.assign(state.peerInfo, peer);
    },
    removePeerInfo(state, name) {

    },
    setStreamInfo(state, info) {
      Object.assign(state.streamInfo, info);
    },
    setRoomInfo(state, info) {
      Object.assign(state.roomInfo, info);
    },
    clearAll() {
      
    }
  }
})