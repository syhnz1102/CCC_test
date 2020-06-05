import store from '../store';
import { eBus } from './eventBus';
import { sendMessage } from './message';

class WebRTC {
  constraints = { video: true, audio: true };

  constructor() {
    
  }

  createVideoStream() {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        store.commit('setStreamInfo', { local: stream });
        resolve(stream);
      } catch (err) {
        console.log(err);
        return alert(`카메라, 마이크 장치를 불러오는 중 오류가 발생하였습니다.`);
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
        streamObj[uid === 'local' ? 'remote' : uid] = stream;
        store.commit('setStreamInfo', streamObj);
        eBus.$emit('addVideo', { isLocal: false, id: uid === 'local' ? 'remote' : uid, stream });
      }
      peer.onicecandidate = e => {
        if (e.candidate) {
          // console.log('candidate 생성');
          sendMessage('CCC-Candidate', { candidate: e.candidate, usage: 'cam', roomId: store.state.roomInfo.roomId, userId: store.state.userInfo });
        }
      };

      let peerObj = {};
      peerObj[uid] = peer;
      store.commit('setPeerInfo', peerObj);
      let s = store.state;
      if (uid === 'local' && s.streamInfo[uid] && s.peerInfo[uid]) s.streamInfo.local.getTracks().forEach(track => s.peerInfo.local.addTrack(track, s.streamInfo.local));
      resolve();
    });
  }

  async createOffer(uid) {
    try {
      const offer = await store.state.peerInfo[uid].createOffer();
      await store.state.peerInfo[uid].setLocalDescription(offer);
      sendMessage('CCC-SDP', { sdp: offer, usage: 'cam', roomId: store.state.roomInfo.roomId, isSfu: uid === 'local', userId: store.state.userInfo });
    } catch (e) {
      console.error(e);
    }
  }

  async createAnswer(sdp, uid) {
    try {
      await store.state.peerInfo[uid].setRemoteDescription(sdp);
      const answer = await store.state.peerInfo[uid].createAnswer();
      await store.state.peerInfo[uid].setLocalDescription(answer);
      sendMessage('CCC-SDP', { sdp: answer, usage: 'cam', roomId: store.state.roomInfo.roomId, isSfu: uid === 'local', userId: store.state.userInfo });
    } catch (e) {
      console.error(e);
    }
  }

  async setRemoteDescription(sdp, uid) {
    await store.state.peerInfo[uid].setRemoteDescription(sdp);
  }

  async setCandidate(candidate, uid) {
    await store.state.peerInfo[uid].addIceCandidate(new RTCIceCandidate(candidate));
  }

  checkMediaDevices() {
    return new Promise(resolve => {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          console.debug('enumerateDevices : ', devices);
          let cam = devices.some(elem => elem.kind === 'videoinput');
          let mic = devices.some(elem => elem.kind === 'audioinput');
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
          // self.setLocalMediaConstraintOptions(false, false);
          popup.on(`카메라, 마이크 장치가 인식되지 않습니다.\n 카메라와 마이크 중 한 개 이상의 장치가 필요합니다.`);
          resolve(false);
        });
    });
  }

  exitRoom() {
    sendMessage('CCC-ExitRoom', { });
  }

  clearVideo(id) {

  }

  clear() {
    store.commit('clearAll');
  }
}

export default new WebRTC();