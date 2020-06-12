import store from '../store';
import { sendMessage } from './message';
import {eBus} from "./eventBus";

class ScreenShare {
  constructor() {

  }

  createShareStream() {
    return new Promise(async (resolve, reject) => {
      try {
        let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        store.commit('setStreamInfo', { screen: stream });
        resolve(stream);
      } catch (err) {
        console.log(err);
        return alert(`화면 공유 영상을 불러오는 중 오류가 발생하였습니다.`);
        // reject(err);
      }
    })
  }

  createPeer(uid) {
    return new Promise(async (resolve, reject) => {
      const peer = new RTCPeerConnection({ iceServers: [{ urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] });
      peer.onaddstream = ({ stream }) => {
        console.debug(`onaddstream :`, stream);
        let streamObj = {};
        streamObj[uid] = stream;
        store.commit('setStreamInfo', streamObj);
        eBus.$emit('share', {
          type: 'add',
          id: 'screen',
          isLocal: false,
          stream,
          count: store.state.roomInfo.count
        })
      }
      // peer.onicecandidate = e => {
      //   if (e.candidate) {
      //     console.log('candidate 생성');
      //     sendMessage('Candidate', { candidate: e.candidate, usage: 'screen', roomId: store.state.roomInfo.roomId, isSfu: true, userId: store.state.userInfo });
      //   }
      // };
      peer.onconnectionstatechange = e => {
        console.debug(`## ${uid} onconnectionstatechange ## `, e.currentTarget.connectionState);
      };
      peer.onicegatheringstatechange = e => {
        if (peer.iceGatheringState === 'complete') {
          sendMessage('SDP', {
            sdp: peer.localDescription,
            usage: 'screen',
            roomId: store.state.roomInfo.roomId,
            isSfu: true,
            userId: store.state.userInfo,
            useMediaSvr: store.state.roomInfo.count > 2 ? 'Y' : 'N'
          });
        }
      }

      let peerObj = {};
      peerObj[uid] = peer;
      store.commit('setPeerInfo', peerObj);

      let s = store.state;
      if (s.streamInfo[uid]) s.streamInfo[uid].getTracks().forEach(track => s.peerInfo['screen'].addTrack(track, s.streamInfo[uid]));
      resolve();
    });
  }

}

export default new ScreenShare();
