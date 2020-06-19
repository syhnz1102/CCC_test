import store from '../store';
import { eBus } from './eventBus';
import { sendMessage } from './message';
import config from '../config';

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
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '영상 통화',
          contents: '카메라, 마이크 장치를 불러오는 중 오류가 발생하였습니다.'
        })
        // reject(err);
      }
    })
  }

  createPeer(uid, isMulti) {
    return new Promise(async (resolve, reject) => {
      const peer = new RTCPeerConnection(config.iceServer);
      peer.onaddstream = ({ stream }) => {
        console.debug(`onaddstream :`, stream);
        let streamObj = {};
        streamObj[uid === 'local' && !isMulti ? 'remote' : uid] = stream;
        store.commit('setStreamInfo', streamObj);

        let info = {};
        if (Object.keys(store.state.roomInfo.members).length > 2) {
          if (store.state.roomInfo.members[uid]) {
            info.name = store.state.roomInfo.members[uid].NAME;
            info.isOffVideo = store.state.roomInfo.members[uid].VIDEO;
            info.isOffMic = store.state.roomInfo.members[uid].AUDIO;
          }
        } else if (Object.keys(store.state.roomInfo.members).length === 2) {
          let remoteId = Object.keys(store.state.roomInfo.members).filter(c => c !== store.state.userInfo.id)[0];
          info.name = store.state.roomInfo.members[remoteId].NAME;
          info.isOffVideo = store.state.roomInfo.members[remoteId].VIDEO;
          info.isOffMic = store.state.roomInfo.members[remoteId].AUDIO;
        }

        eBus.$emit('video', {
          type: 'add',
          isLocal: false,
          id: uid === 'local' && !isMulti ? 'remote' : uid,
          stream,
          count: store.state.roomInfo.count,
          info,
        });
      }
      // peer.onicecandidate = e => {
      //   if (e.candidate) {
      //     console.log('candidate 생성');
      //     sendMessage('Candidate', { candidate: e.candidate, usage: 'cam', roomId: store.state.roomInfo.roomId, isSfu: true, userId: store.state.userInfo.id });
      //   }
      // };
      peer.onconnectionstatechange = e => {
        console.debug(`## ${uid} onconnectionstatechange ## `, e.currentTarget.connectionState)
      };
      peer.onicegatheringstatechange = e => {
        if (peer.iceGatheringState === 'complete') {
          sendMessage('SDP', { sdp: peer.localDescription, usage: 'cam', roomId: store.state.roomInfo.roomId, isSfu: true, userId: store.state.userInfo.id });
        }
      }

      let peerObj = {};
      peerObj[uid] = peer;
      store.commit('setPeerInfo', peerObj);
      let s = store.state;
      let id = uid === 'local' ? 'local' : uid;
      console.log(s)
      s.streamInfo.local.getTracks().forEach(track => s.peerInfo[id].addTrack(track, s.streamInfo.local));
      resolve();
    });
  }

  async createOffer(uid) {
    try {
      const offer = await store.state.peerInfo[uid].createOffer();
      await store.state.peerInfo[uid].setLocalDescription(offer);
      // sendMessage('SDP', { sdp: offer, usage: 'cam', roomId: store.state.roomInfo.roomId, isSfu: true, userId: store.state.userInfo.id });
    } catch (e) {
      console.error(e);
    }
  }

  async createAnswer(sdp, uid) {
    try {
      await store.state.peerInfo[uid].setRemoteDescription(sdp);
      const answer = await store.state.peerInfo[uid].createAnswer();
      await store.state.peerInfo[uid].setLocalDescription(answer);
      // sendMessage('SDP', { sdp: answer, usage: 'cam', roomId: store.state.roomInfo.roomId, isSfu: true, userId: store.state.userInfo.id });
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
          if (cam && mic) {
            resolve(true);
          } else {
            eBus.$emit('popup', {
              on: true,
              type: 'Confirm',
              title: '통화 방 입장 오류',
              contents: `${!cam && !mic ? '카메라, 마이크' : !cam ? '카메라' : '마이크'} 장치가 인식되지 않습니다.\n회의실에 입장 하시겠습니까?`,
              ok: () => {
                eBus.$emit('popup', { on: false });
                resolve(true);
              },
              cancel: () => {
                resolve(false);
              }
            })
          }
        })
        .catch(e => {
          console.error('## devices are not found: ', e);
          eBus.$emit('popup', {
            on: true,
            type: 'Confirm',
            title: '통화 방 입장 오류',
            contents: `카메라, 마이크 장치가 인식되지 않습니다.\n회의실에 입장 하시겠습니까?`,
            ok: () => {
              eBus.$emit('popup', { on: false });
              resolve(true);
            },
            cancel: () => {
              resolve(false);
            }
          })
        });
    });
  }

  setConstraint(constraints) {
    let s = store.state.streamInfo;
    if (s.local) {
      const tracks = s.local.getTracks();
      tracks.forEach(async curr => {
        if (curr.kind === 'video') {
          await curr.applyConstraints(constraints);
          console.debug('getConstraints ----------> ', curr.getConstraints());
        }
      });
    }
  }

  destroyRoom() {
    sendMessage('DestroyRoom', { roomId: store.state.roomInfo.roomId });
  }

  clear() {
    store.commit('clearAll');
  }
}

export default new WebRTC();
