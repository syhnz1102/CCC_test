import store from '../store';
import { sendMessage } from './message';
import { eBus } from "./eventBus";
import config from '../config';

class ScreenShare {
  constructor() {

  }

  createShareStream() {
    return new Promise(async (resolve, reject) => {
      // 200617 ivypark, v0.9.2. 에러 무시. Stream 안나온 경우 에러팝업 뜨지 않도록 변경
      let stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      if (typeof stream === 'object' && stream) {
        store.commit('setStreamInfo', { screen: stream });
        resolve(stream);
      }
      // try {
      // } catch (err) {
      //   console.log(err);
      //   return eBus.$emit('popup', {
      //     on: true,
      //     type: 'Alert',
      //     title: '화면 공유',
      //     contents: '화면 공유 영상을 불러오는 중 문제가 발생하였습니다.'
      //   })
      // }
    })
  }

  createPeer(uid) {
    return new Promise(async (resolve, reject) => {
      const peer = new RTCPeerConnection(config.iceServer);
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

      peer.onconnectionstatechange = e => {
        console.debug(`## ${uid} onconnectionstatechange ## `, e.currentTarget.connectionState);
      };
      peer.onicegatheringstatechange = e => {
        // 200703 ivypark, v1.0.2. gatheringstate -> candidate null 일때 SDP 전송으로 변경
        if (peer.iceGatheringState === 'complete') {
          // sendMessage('SDP', {
          //   sdp: peer.localDescription,
          //   usage: 'screen',
          //   roomId: store.state.roomInfo.roomId,
          //   isSfu: true,
          //   userId: store.state.userInfo.id,
          //   useMediaSvr: store.state.roomInfo.count > 2 ? 'Y' : 'N'
          // });
        }
      }
      peer.onicecandidate = e => {
        if (!e.candidate) {
          // sendMessage('Candidate', { candidate: e.candidate, usage: 'screen', roomId: store.state.roomInfo.roomId, isSfu: true, userId: store.state.userInfo.id });
          sendMessage('SDP', {
            sdp: peer.localDescription,
            usage: 'screen',
            roomId: store.state.roomInfo.roomId,
            isSfu: true,
            userId: store.state.userInfo.id,
            useMediaSvr: store.state.roomInfo.count > 2 ? 'Y' : 'N'
          });
        }
      };

      let peerObj = {};
      peerObj[uid] = peer;
      store.commit('setPeerInfo', peerObj);

      let s = store.state;
      if (s.streamInfo[uid]) {
        s.streamInfo[uid].getTracks().forEach(track => {
          s.peerInfo['screen'].addTrack(track, s.streamInfo[uid]);
          track.onended = () => {
            eBus.$emit('share', {
              type: 'remove',
              isSharer: true
            })
            track.stop();
          }
        });
      }

      resolve();
    });
  }

}

export default new ScreenShare();
