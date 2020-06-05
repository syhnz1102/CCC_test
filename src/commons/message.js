import store from '../store';
import router from '../router';
import webRTC from './webrtc';

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
      if (resp.members) store.commit('setRoomInfo', { members: resp.members, roomId: resp.roomId, count: resp.members.length });
      break;

    case 'CCC-StartSession':
      sendMessage('CCC-StartSession', { code: '200' });
      if (resp.members) store.commit('setRoomInfo', { count: resp.members.length });

      await webRTC.createPeer(resp.useMediaSvr === 'N' ? 'local' : resp.who);
      webRTC.createOffer(resp.useMediaSvr === 'N' ? 'local' : resp.who);
      break;

    case 'CCC-SDP':
      if (resp.usage === 'cam') {
        if (resp.sdp.type === 'offer') {
          await webRTC.createPeer(resp.useMediaSvr === 'N' ? 'local' : resp.userId);
          webRTC.createAnswer(resp.sdp, resp.useMediaSvr === 'N' ? 'local' : resp.userId);
          sendMessage('CCC-SDP', { code: '200' });
        } else if (resp.sdp.type === 'answer') {
          webRTC.setRemoteDescription(resp.sdp, resp.useMediaSvr === 'N' ? 'local' : resp.userId);
          sendMessage('CCC-SDP', { code: '200' });
        }
      }
      break;

    case 'CCC-Candidate':
      if (resp.usage === 'cam') {
        if (resp.candidate) webRTC.setCandidate(resp.candidate, resp.useMediaSvr === 'N' ? 'local' : resp.userId);
        sendMessage('CCC-Candidate', { code: '200' });
      }
      break;
  }
}

export function sendMessage(op, data = {}) {
  Object.assign(data, { eventOp: op });
  // console.debug(`[ ${op} ] Web -> Signal `, data);
  store.state.socket.emit('knowledgetalk', data);
}