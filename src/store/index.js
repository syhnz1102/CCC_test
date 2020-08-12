import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: null,
    peerInfo: {},
    streamInfo: {},
    roomInfo: {},
    userInfo: {},
    language: ''
  },
  mutations: {
    setSocketIo(state, socket) {
      state.socket = socket;
    },
    setPeerInfo(state, peer) {
      Object.assign(state.peerInfo, peer);
    },
    removePeerInfo(state, name) {
      if (state.peerInfo[name]) {
        state.peerInfo[name].close();
        delete state.peerInfo[name];
      }

      console.log(name, 'ivypark peerInfo ----> ', state.peerInfo);
    },
    setStreamInfo(state, info) {
      Object.assign(state.streamInfo, info);
    },
    removeStreamInfo(state, name) {
      if (state.streamInfo[name]) {
        state.streamInfo[name].getTracks().forEach(track => {
          track.stop();
        });

        delete state.streamInfo[name];
      }

      console.log(name, 'ivypark streaminfo ----> ', state.streamInfo);
    },
    setRoomInfo(state, info) {
      Object.assign(state.roomInfo, info);
    },
    setUserInfo(state, info) {
      Object.assign(state.userInfo, info);
    },
    setLanguage(state, info) {
      state.language = info;
    },
    clearAll(state) {
      if (Object.keys(state.streamInfo).length > 0) {
        for (let c in state.streamInfo) {
          state.streamInfo[c].getTracks().forEach(track => {
            track.stop();
          });
        }
        state.streamInfo = {};
      }

      for (let c in state.peerInfo) {
        state.peerInfo[c].close();
        delete state.peerInfo[c];
      }

      state.userInfo = {};
      state.roomInfo = {}
      if (state.socket) state.socket.close();
      state.socket = null;
    }
  }
})
