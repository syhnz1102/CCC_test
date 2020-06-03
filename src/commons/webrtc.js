import store from '../store';
import { eBus } from './eventBus';
import { sendMessage } from './message';

class WebRTC {
  constraints = { video: true, audio: true };
  peer = null;
  stream = null;

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

  createPeer() {
    return new Promise(async (resolve, reject) => {
      const peer = new RTCPeerConnection({ iceServers: [{ urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] });
      peer.onaddstream = ({ stream }) => {
        console.debug(`onaddstream :`, stream);
        eBus.$emit('addVideo', { isLocal: false, id: 'id', stream });
        // streamInfo[s.sessionId] = stream;
        // self.videoSetting('MainVideo', `video_${s.sessionId}`, streamInfo[s.sessionId], sessionInfo[s.sessionId].peer.name);
      }
      peer.onicecandidate = e => {
        if (e.candidate) {
          console.log('candidate 생성');
          sendMessage('CCC-Candidate', { candidate: e.candidate, usage: 'cam', roomId: store.state.roomInfo.roomId });
        }
      };

      store.commit('setPeerInfo', { local: peer });
      let s = store.state;
      if (s.streamInfo && s.peerInfo) s.streamInfo.local.getTracks().forEach(track => s.peerInfo.local.addTrack(track, s.streamInfo.local));
      resolve();
    });
  }

  async createOffer() {
    try {
      const offer = await store.state.peerInfo['local'].createOffer();
      await store.state.peerInfo['local'].setLocalDescription(offer);
      sendMessage('CCC-SDP', { sdp: offer, usage: 'cam', roomId: store.state.roomInfo.roomId });
    } catch (e) {
      console.error(e);
    }
  }

  async createAnswer(sdp) {
    try {
      await store.state.peerInfo['local'].setRemoteDescription(sdp);
      const answer = await store.state.peerInfo['local'].createAnswer();
      await store.state.peerInfo['local'].setLocalDescription(answer);
      sendMessage('CCC-SDP', { sdp: answer, usage: 'cam', roomId: store.state.roomInfo.roomId });
    } catch (e) {
      console.error(e);
    }
  }

  async setRemoteDescription(sdp) {
    await store.state.peerInfo['local'].setRemoteDescription(sdp);
  }

  async setCandidate(candidate) {
    await store.state.peerInfo['local'].addIceCandidate(new RTCIceCandidate(candidate));
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
}

export default new WebRTC();












/**
 * 
 *   createPeer() {
    return new Promise(async (resolve, reject) => {
      // const peer = new RTCPeerConnection({ iceServers: [{ urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] });
      const peer = new RTCPeerConnection({ iceServers: [{ urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] });
      peer.onaddstream = ({ stream }) => {
        console.debug(`${s.sessionId}'s onaddstream :`, stream);
        streamInfo[s.sessionId] = stream;
        // self.videoSetting('MainVideo', `video_${s.sessionId}`, streamInfo[s.sessionId], sessionInfo[s.sessionId].peer.name);
      }
      peer.onicecandidate = e => {
        if (e.candidate) {
          console.log('candidate 생성');
          // message.send('room', { r_method: 'candidate', sessionId: s.sessionId, candidate: e.candidate });
        }
      };

      store.commit('addPeer', { local: peer });
      console.log(store.state.peerInfo);
      
      // streamInfo.local.getTracks().forEach(track => peerInfo[s.sessionId].addTrack(track, streamInfo.local));
      resolve();
    });
  }

  async createOffer() {
    try {
      const offer = await store.state.peerInfo['local'].createOffer()
      console.log('setLocalDescription', 'offer');
      // await store.state.peerInfo['local'].setLocalDescription(offer);
      store.state.peerInfo['local'].setLocalDescription(offer).then(a => {console.log('a')}).catch(e => {console.error(e)});
      sendMessage('CCC-SDP', { sdp: offer, usage: 'cam', roomId: store.state.roomInfo.roomId });
    } catch (e) {
      console.error(e);
    }
  }

  async createAnswer(sdp) {
    try {
      // await store.state.peerInfo['local'].setRemoteDescription(sdp)
      store.state.peerInfo['local'].setRemoteDescription(sdp).then(a => {console.log('a')}).catch(e => {console.error(e)});
      const answer = await store.state.peerInfo['local'].createAnswer();
      // await store.state.peerInfo['local'].setLocalDescription(answer)
      store.state.peerInfo['local'].setLocalDescription(answer).then(a => {console.log('a')}).catch(e => {console.error(e)});
      sendMessage('CCC-SDP', { sdp: answer, usage: 'cam', roomId: store.state.roomInfo.roomId });
    } catch (e) {
      console.error(e);
    }
  }

  async setRemoteDescription(sdp) {
    // await store.state.peerInfo['local'].setRemoteDescription(sdp)
    store.state.peerInfo['local'].setRemoteDescription(sdp).then(a => {console.log('a')}).catch(e => {console.error(e)});
  }
 */