import store from '../store';
import webRTC from './webrtc';

export async function on(resp) {
  console.debug(`[ ${resp.eventOp} ] Signal -> Web `, resp);
  switch (resp.eventOp) {
    case 'CCC-Join':
      if (resp.code === '400') {
        // alert('회의 방이 만료되었습니다. 초기 화면으로 이동합니다.');
        window.location.href = '/';
      }
      if (resp.members) store.commit('setRoomInfo', { members: resp.members, roomId: resp.roomId, count: resp.members.length });
      break;

    case 'CCC-CheckRoom':
      if (resp.status === 'expire') {
        alert('회의 방이 만료되었습니다. 초기 화면으로 이동합니다.');
        window.location.href = '/';
      }
      break;

    case 'CCC-StartSession':
      sendMessage('CCC-StartSession', { code: '200' });
      store.commit('setRoomInfo', { count: resp.members.length });
      await webRTC.createPeer();
      webRTC.createOffer();
      break;

    case 'CCC-SDP':
      if (resp.usage === 'cam') {
        if (resp.sdp.type === 'offer') {
          await webRTC.createPeer();
          webRTC.createAnswer(resp.sdp);
          sendMessage('CCC-SDP', { code: '200' });
        } else if (resp.sdp.type === 'answer') {
          webRTC.setRemoteDescription(resp.sdp);
          sendMessage('CCC-SDP', { code: '200' });
        }
      }
      break;

    case 'CCC-Candidate':
      if (resp.usage === 'cam') {
        if (resp.candidate) webRTC.setCandidate(resp.candidate);
        sendMessage('CCC-Candidate', { code: '200' });
      }
      break;
  }
}

export function sendMessage(op, data = {}) {
  Object.assign(data, { eventOp: op });
  console.debug(`[ ${op} ] Web -> Signal `, data);
  store.state.socket.emit('knowledgetalk', data);
}