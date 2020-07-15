export default {
  version: 'v1.0.7 (0715)',
  // socketIoUrl: 'https://ktgenie.com:7103/SignalServer', // TB
  // socketIoUrl: 'https://localhost:7103/SignalServer', // LOCAL
  socketIoUrl: 'https://cococall.net:7103/SignalServer', // RELEASED
  iceServer: { iceServers: [{ urls: 'turn:13.125.217.175:46000', username: 'kpoint', credential: 'kpoint01' }, { urls : 'stun:13.125.217.175:46000' }, { urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] }, // RELEASED
  constraints: {
    share: { width: 480, height: 270 }, // video constraint when screen sharing
    p2p: { width: 960, height: 540 }, // 1 by 1
    four: { width: 640, height: 360 }, // 2 by 2
    six: { width: 480, height: 270 }, // 3 by 2
    nine: { width: 480, height: 270 }, // 3 by 3
    twelve: { width: 320, height: 180 }, // 4 by 3
    sixteen: { width: 240, height: 135 }, // 4 by 4
  },
  lengthOfRoomId: 8,
  listOfDomains: ['localhost', 'ktgenie.com', 'cococall.net']
}
