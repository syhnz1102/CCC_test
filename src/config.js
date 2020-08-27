export default {
  version: 'v1.1.1-rc2 (0827)',
  env: 'PROD', // 'LOCAL', 'TB', 'PROD'
  socketIoUrl: {
    LOCAL: 'https://localhost:7103/SignalServer',
    TB: 'https://ktgenie.com:7103/SignalServer',
    PROD: 'https://cococall.net:7103/SignalServer'
  },
  developerMode: false,
  privateMode: {
    switch: false,
    cpName: 'KnowledgePoint',
    cpCode: {
      LOCAL: 'KP-20200101-01',
      TB: 'KP-20200101-01',
      PROD: 'KP-20200101-01'
    },
    authKey: {
      LOCAL: '', // knowledgepointtoken
      TB: '', // knowledgepointtoken
      PROD: '' // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi64Kg66as7KeA7Y-s7J247Yq4IiwibWF4VXNlciI6IjUwMDAwMDAwIiwic3RhcnREYXRlIjoiMjAyMC0wMS0wMVQwNjo0NzowMC4wMDBaIiwiZW5kRGF0ZSI6IjIwMzAtMTItMzFUMDY6NDc6MDAuMDAwWiIsImF1dGhDb2RlIjoiS1AtMjAyMDAxMDEtMDEiLCJjb21wYW55Q29kZSI6IkxJQy0wMSIsImlhdCI6MTU4NzUzODExNH0.73A0UiiMHJeIS8pIgoN4DfEWT4QCsMnXkO4uUdnfbYI
    }
  },
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
