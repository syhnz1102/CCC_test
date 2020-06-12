import store from '../store';
import router from '../router';
import webRTC from './webrtc';
import { eBus } from "./eventBus";
import screenShare from "./screenshare";

export async function on(resp) {
  console.debug(`[ ${resp.eventOp} ] Signal -> Web `, resp);
  switch (resp.eventOp || resp.signalOp) {
    case 'CCC-CreateRoom':
      if (resp.code === '200') {
        router.push({ path: `/room/${resp.roomId}` });
      }
      break;
    case 'CCC-Join':
      if (resp.code === '400') {
        // alert('회의 방이 만료되었습니다. 초기 화면으로 이동합니다.');
        window.location.href = '/';
      }
      store.commit('setUserInfo', resp.userId);
      if (resp.members) store.commit('setRoomInfo', { members: resp.members, roomId: resp.roomId, count: Object.keys(resp.members).length, type: Object.keys(resp.members).length > 2 ? 'multi' : 'p2p' });
      break;

    case 'CCC-StartSession':
      sendMessage('CCC-StartSession', { code: '200' });
      if (resp.members) store.commit('setRoomInfo', { count: Object.keys(resp.members).length, type: resp.useMediaSvr === 'Y' ? 'multi' : 'p2p' });
      if (resp.useMediaSvr === 'Y') {
        if (resp.changeView) {
          store.commit('removePeerInfo', 'local');
          await webRTC.createPeer('local', resp.useMediaSvr);
          webRTC.createOffer('local');
        }
      } else {
        await webRTC.createPeer('local', resp.useMediaSvr);
        webRTC.createOffer('local');
      }
      break;

    case 'SDP':
      if (resp.code === '200') return;
      if (resp.usage === 'cam') {
        if (resp.sdp.type === 'offer') {
          await webRTC.createPeer(resp.useMediaSvr === 'N' ? 'local' : resp.displayId);
          webRTC.createAnswer(resp.sdp, resp.useMediaSvr === 'N' ? 'local' : resp.displayId);
          sendMessage('SDP', { code: '200' });
        } else if (resp.sdp.type === 'answer') {
          // if (resp.useMediaSvr === 'Y') await webRTC.createPeer(resp.userId);
          webRTC.setRemoteDescription(resp.sdp, 'local');
          sendMessage('SDP', { code: '200' });
        }
      } else if (resp.usage === 'screen') {
        if (resp.sdp.type === 'offer') {
          await screenShare.createPeer('screen');
          webRTC.createAnswer(resp.sdp, 'screen');
          sendMessage('SDP', { code: '200' });
        } else if (resp.sdp.type === 'answer') {
          webRTC.setRemoteDescription(resp.sdp, 'screen');
          sendMessage('SDP', { code: '200' });
        }
      }
      break;

    case 'Candidate':
      if (resp.usage === 'cam') {
        if (resp.candidate) webRTC.setCandidate(resp.candidate, resp.useMediaSvr === 'N' ? 'local' : resp.userId);
        sendMessage('Candidate', { code: '200' });
      }
      break;

    case 'SessionReserve':
      if (resp.code === '200') {
        let stream = await screenShare.createShareStream();
        await screenShare.createPeer('screen');
        await webRTC.createOffer('screen');
        eBus.$emit('share', {
          type: 'add',
          id: 'screen',
          isLocal: true,
          stream,
          count: store.state.roomInfo.count
        })
      } else {
        return alert('지금은 화면공유를 진행 할 수 없습니다.');
      }
      break;

    case 'ScreenShareConferenceEndSvr':
      eBus.$emit('share', {
        type: 'remove'
      })
      break;

    case 'Presence':
      if (resp.action === 'exit') {
        store.commit('setRoomInfo', { count: store.state.roomInfo.count - 1 });

        eBus.$emit('video', {
          type: 'remove',
          count: store.state.roomInfo.count,
          id: store.state.roomInfo.count > 2 ? resp.userId : 'remote'
        })
      }
      break;
  }
}

export function sendMessage(op, data = {}) {
  Object.assign(data, { eventOp: op });
  console.debug(`[ ${op} ] Web -> Signal `, data);
  store.state.socket.emit('knowledgetalk', data);
}
