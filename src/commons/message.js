import store from '../store';
import router from '../router';
import webRTC from './webrtc';
import screenshare from './screenshare';

export async function on(resp) {
  console.debug(`[ ${resp.eventOp} ] Signal -> Web `, resp);
  switch (resp.eventOp) {
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
        if (resp.sdp.type === 'offer' && resp.useMediaSvr === 'N') {
          await screenshare.createPeer('screen');
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
  }
}

export function sendMessage(op, data = {}) {
  Object.assign(data, { eventOp: op });
  console.debug(`[ ${op} ] Web -> Signal `, data);
  store.state.socket.emit('knowledgetalk', data);
}