export default {
  version: 'v1.0.4 (0708)',
  // socketIoUrl: 'https://ktgenie.com:7103/SignalServer', // TB
  // socketIoUrl: 'https://localhost:7103/SignalServer', // LOCAL
  socketIoUrl: 'https://cococall.net:7103/SignalServer', // RELEASED
  // iceServer: { iceServers: [{ urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] }, // TB, LOCAL
  iceServer: { iceServers: [{ urls: 'turn:13.125.217.175:46000', username: 'kpoint', credential: 'kpoint01' }, { urls : 'stun:13.125.217.175:46000' }, { urls: 'turn:106.240.247.44:46000', username: 'kpoint', credential: 'kpoint01' }] }, // RELEASED
  constraints: {
    share: { width: 480, height: 270 }, // video constraint when screen sharing
    p2p: { width: 960, height: 540 }, // 1 by 1
    four: { width: 640, height: 360 }, // 2 by 2
    six: { width: 480, height: 270 }, // 3 by 2
    nine: { width: 480, height: 270 }, // 3 by 3
    twelve: { width: 320, height: 180 }, // 4 by 3
    sixteen: { width: 240, height: 135 }, // 4 by 4
    // p2p: { width: 1280, height: 720 }, // 1 by 1
    // four: { width: 960, height: 540 }, // 2 by 2
    // six: { width: 640, height: 360 }, // 3 by 2
    // nine: { width: 640, height: 360 }, // 3 by 3
    // twelve: { width: 480, height: 270 }, // 4 by 3
    // sixteen: { width: 320, height: 180 }, // 4 by 4
  }
}
