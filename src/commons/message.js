import store from '../store';
import router from '../router';
import webRTC from './webrtc';
import mobile from './mobile';
import { eBus } from "./eventBus";
import screenShare from "./screenshare";
import utils from './utils';
import config from '../config';

export async function onMessage(resp) {
  console.debug(`[ ${resp.eventOp} ] Signal -> Web `, resp);
  if (config.privateMode.switch && resp.code === '412') {
    return eBus.$emit('popup', {
      on: true,
      type: 'Alert',
      title: '회의 참여',
      contents: '잘못된 경로로 접근하였습니다. 초기화면으로 이동합니다.',
      cancel: () => {
        window.location.href = utils.getPrivateUrl();
      }
    })
  }

  if (resp.code === '504') {
    eBus.$emit(Object.keys(store.state.roomInfo).length ? 'popup' : 'popup-main', {
      on: true,
      type: 'Alert',
      title: '서버 오류',
      contents: '서버와의 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.',
      cancel: () => {
        window.location.href = utils.getPrivateUrl();
      }
    });
  }

  switch (resp.eventOp || resp.signalOp) {
    case 'CreateRoom':
      if (resp.code === '200') {
        store.commit('setRoomInfo', { roomId: resp.roomId });

        // 200622 ivypark, v0.9.4. mobile 입장 코드 추가 (가로모드 관련 이슈로 인해 redirect를 android에서 직접 하도록 함)
        // if (mobile.isMobile && mobile.isWebView && !mobile.isPlayBrowser) {
        //   mobile.onStartConference(resp.roomId);
        // } else {
          router.push({ path: `${resp.cp ? '/'+resp.cp : ''}/room/${resp.roomId}` });
        // }
      }
      break;
    case 'RoomJoin':
      if (resp.code === '400') {
        return eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '회의 참여',
          contents: '회의 방이 만료되었습니다. 초기 화면으로 이동합니다.',
          cancel: () => {
            window.location.href = '/';
          }
        })
      }
      store.commit('setUserInfo', { id: resp.userId, name: '익명' });
      if (resp.members) store.commit('setRoomInfo', { members: resp.members, roomId: resp.roomId, count: Object.keys(resp.members).length, type: Object.keys(resp.members).length > 2 ? 'multi' : 'p2p' });
      break;

    case 'StartSession':
      sendMessage('StartSession', { code: '200' });
      if (resp.members) store.commit('setRoomInfo', { members: resp.members, count: Object.keys(resp.members).length, type: resp.useMediaSvr === 'Y' ? 'multi' : 'p2p', host: resp.host });
      if (resp.useMediaSvr === 'Y') {
        if (resp.changeView || resp.who === store.state.userInfo.id) {
          // 200619 ivypark, v0.9.3. 1:1 -> N:N 전환 시 화면공유 종료 (stream이 3번째 사용자에게 전달 되지 않음. 끊는 것이 날리지톡 정책)
          if (store.state.streamInfo.screen) {
            eBus.$emit('share', { type: 'remove' });
            eBus.$emit('popup', { on: true, type: 'Alert', title: '화면 공유', contents: '다자 통화 화면 전환으로 인해 화면공유가 종료됩니다.' });
          }

          store.commit('removePeerInfo', 'local');
          await webRTC.createPeer('local', resp.useMediaSvr === 'Y');
          await webRTC.createOffer('local');
        }
      } else {
        await webRTC.createPeer('local', resp.useMediaSvr === 'Y');
        await webRTC.createOffer('local');
      }
      break;

    case 'SDP':
      if (resp.code === '200') return;
      if (resp.usage === 'cam') {
        if (resp.sdp.type === 'offer') {
          await webRTC.createPeer(resp.useMediaSvr === 'N' ? 'local' : resp.displayId, resp.useMediaSvr === 'Y', resp.pluginId);
          await webRTC.createAnswer(resp.sdp, resp.useMediaSvr === 'N' ? 'local' : resp.displayId);
          sendMessage('SDP', { code: '200' });
        } else if (resp.sdp.type === 'answer') {
          // if (resp.useMediaSvr === 'Y') await webRTC.createPeer(resp.userId);
          await webRTC.setRemoteDescription(resp.sdp, 'local');
          sendMessage('SDP', { code: '200' });
        }
      } else if (resp.usage === 'screen') {
        if (resp.sdp.type === 'offer') {
          await screenShare.createPeer('screen', resp.useMediaSvr === 'Y', resp.pluginId);
          await webRTC.createAnswer(resp.sdp, 'screen');
          sendMessage('SDP', { code: '200' });
        } else if (resp.sdp.type === 'answer') {
          await webRTC.setRemoteDescription(resp.sdp, 'screen');
          sendMessage('SDP', { code: '200' });
        }
      }
      break;

    case 'Candidate':
      if (resp.usage === 'cam') {
        if (resp.candidate) await webRTC.setCandidate(resp.candidate, resp.useMediaSvr === 'N' ? 'local' : resp.userId);
        sendMessage('Candidate', { code: '200' });
      }
      break;

    case 'ReceiveFeed':
      // sendMessage('ReceiveFeed', { code: '200' });

      // TODO: 200728 ivypark, functionalization
      resp.feeds.forEach(curr => {
        sendMessage('SendFeed', { roomId: resp.roomId, feedId: curr.id, display: curr.display });
      })
      break;

    case 'SendFeed':
      // TODO.
      break;

    case 'SessionReserve':
      if (resp.code === '200') {
        let stream = await screenShare.createShareStream();
        await screenShare.createPeer('screen', store.state.roomInfo.count > 2);
        await webRTC.createOffer('screen');
        eBus.$emit('share', {
          type: 'add',
          id: 'screen',
          isLocal: true,
          stream,
          count: store.state.roomInfo.count
        })
      } else {
        eBus.$emit('popup', {
          on: true,
          type: 'Alert',
          title: '화면 공유',
          contents: '지금은 화면 공유를 진행할 수 없습니다.'
        })
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
        if (store.state.roomInfo.count <= 1 && store.state.peerInfo.hasOwnProperty('screen')) {
          eBus.$emit('share', {
            type: 'remove',
            isSharer: true
          })
          eBus.$emit('popup', {
            on: true,
            type: 'Alert',
            title: '화면 공유',
            contents: '다른 모든 사용자가 통화를 종료하여 화면공유가 종료됩니다.'
          })
        }
          eBus.$emit('video', {
            type: 'remove',
            count: store.state.roomInfo.count,
            id: store.state.roomInfo.type === 'p2p' ? 'remote' : resp.userId
          })
        } else if (resp.action === 'join') {
          if (resp.members) store.commit('setRoomInfo', { members: resp.members, count: Object.keys(resp.members).length });
        } else if (resp.action === 'talking') {
          //화자감지 이벤트 수신
          //action 추가 : talking
          if (store.state.showsSpeaker && store.state.roomInfo.count > 2){
            eBus.$emit('setVideo',{
              id : resp.who === store.state.userInfo.id ? 'local' : resp.who,
              isTalking : resp.talking
            });
          }
        }
      break;

    case 'ChangeName':
      eBus.$emit('video', {
        type: 'set',
        id: store.state.roomInfo.type === 'p2p' ? 'remote' : resp.userId,
        name: resp.name
      })
      break;

    case 'SetAudio':
      eBus.$emit('video', {
        type: 'set',
        id: store.state.roomInfo.type === 'p2p' ? 'remote' : resp.userId,
        isOffMic: resp.status
      })
      break;

    case 'SetVideo':
      eBus.$emit('video', {
        type: 'set',
        id: store.state.roomInfo.type === 'p2p' ? 'remote' : resp.userId,
        isOffVideo: resp.status
      })
      break;

    case 'Talking':
      eBus.$emit('video', {
        type: 'set',
        id: store.state.roomInfo.type === 'p2p' ? 'remote' : resp.userId,
        isTalking: resp.status
      })
      break;
  }
}

export function sendMessage(op, data = {}, type = 'eventOp') {
  let obj = {};
  obj[type] = op;
  obj['cpCode'] = config.privateMode.cpCode[config.env];
  obj['authKey'] = config.privateMode.authKey[config.env];
  Object.assign(data, obj);
  console.debug(`[ ${op} ] Web -> Signal `, data);
  store.state.socket.emit('knowledgetalk', data);
}
