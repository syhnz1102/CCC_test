<template>
  <div class="video" ref="video" v-bind:id="this.id" v-bind:class="{ 'local': this.isLocalVideo, 'camOff': offVideo, 'speaker': this.isTalking }">
    <div style="color: greenyellow; position:absolute; bottom: 50px" v-if="report">{{ report }}</div>
    <div class="userContainer">
      <div class="user">
        <span class="name" v-bind:class="{ 'micOff': offMic }">{{ name }}</span>
        <button v-if="id === 'local'" @click="handleChangeName">이름변경</button>
      </div>
    </div>
  </div>
</template>

<script>
import { eBus } from '../commons/eventBus';
import utils from '../commons/utils';
import config from "../config";
import store from "../store";
import getStats from '../lib/getStats';

export default {
  props: { isLocal: Boolean, isOffVideo: Boolean, isOffMic: Boolean, vid: String, userName: String },
  data() {
    return {
      isLocalVideo: this.isLocal,
      id: this.isLocal ? 'local' : this.vid,
      name: this.userName,
      offVideo: this.isOffVideo,
      offMic: this.isOffMic,
      isTalking: false,
      report: null,
      bytes: 0,
      packets: 0
    }
  },
  mounted() {
    this.attachVideo(this.isOffVideo);
    // if (!this.isOffVideo) this.attachVideo();
    eBus.$on('setVideo', async param => {
      // 200618 ivypark, v0.9.2. 1:1 공유 중 cam/mic off 시 로컬화면이 분리되는 현상 수정
      this.isLocalVideo = this.id === 'local' && (!this.$store.state.roomInfo.count || this.$store.state.roomInfo.count <= 2) && !this.$store.state.streamInfo.screen;

      if (param.id === this.id && param.hasOwnProperty('name')) this.name = param.name;
      if (param.hasOwnProperty('showsSpeaker') && !param.showsSpeaker) this.isTalking = false; //화자감지 표시 중 기능 off 시 효과 없애기
      if (param.id === this.id && param.hasOwnProperty('isTalking')) this.isTalking = param.isTalking; //화자감지 on
      if (param.id === this.id && param.hasOwnProperty('isOffMic')) this.offMic = param.isOffMic;
      if (param.id === this.id && param.hasOwnProperty('isOffVideo')) {
        // 200702 ivypark, v1.0.1. 비디오 off 시 소리 들리지 않는 현상 수정. (기존 비디오 삭제 -> display: none, block으로 변경되도록 수정)
        this.$refs.video.querySelector('video').style = param.isOffVideo ? `display: none` : `display: block`;
        // this.$refs.video.querySelector('video').remove() : this.attachVideo();
        this.offVideo = param.isOffVideo;
      }
      if (param.id === this.id && param.hasOwnProperty('deviceSetting')) {
        this.$refs.video.querySelector('video').muted = true;
        if (param.deviceSetting.stream) {
          this.$refs.video.querySelector('video').srcObject = null;
          this.$refs.video.querySelector('video').srcObject = param.deviceSetting.stream;
          await this.$refs.video.querySelector('video').play();
        }
        if (param.deviceSetting.hasOwnProperty('done')) this.$refs.video.querySelector('video').muted = param.deviceSetting.done;
        if (param.deviceSetting.hasOwnProperty('sinkId')) await this.$refs.video.querySelector('video').setSinkId(param.deviceSetting.sinkId);
      }
    })
  },
  methods: {
    attachVideo(isOff) {
      let video = document.createElement('video');
      video.srcObject = this.$store.state.streamInfo[this.isLocalVideo ? 'local' : (this.$store.state.roomInfo.type === 'p2p' ? 'remote' : this.id)];
      video.autoplay = true;
      video.muted = this.isLocalVideo;
      video.playsInline = true;
      if (this.$refs.video.firstChild) this.$refs.video.insertBefore(video, this.$refs.video.firstChild);
      // 200714 ivypark, v1.0.7. 화면 off후 신규 참가자 입장 시 카메라 화면이 출력되지 않는 문제 수정
      this.$refs.video.querySelector('video').style = isOff ? `display: none` : `display: block`;

      if (config.developerMode) {
        setInterval(() => {
          let peerInfo = store.state.peerInfo;
          if (Object.keys(peerInfo).length) {
            let localPeer = peerInfo['local'];
            let sender = localPeer.getSenders();
            let track;
            sender.forEach(curr => {
              if (curr.track.kind === 'video') track = curr;
            })
            if (!track) return;
            track.getStats().then(r => {
              r.forEach(report => {
                let bytes;
                let packets;
                if (report.type === 'outbound-rtp') {
                  if (report.isRemote) {
                    return;
                  }
                  const now = report.timestamp;
                  bytes = report.bytesSent;
                  packets = report.packetsSent;
                  console.debug('[ local report ] - ', report);
                  console.debug('local : ', now, packets, bytes);
                }
                this.report = JSON.stringify(report);
              });
            })
          }
        }, 10000)
      }
    },
    handleChangeName() {
      eBus.$emit('popup', {
        on: true,
        type: 'ChangeName',
        title: this.$t('popup-change-name-title'),
        ok: (param) => {
          this.name = param.name;
        }
      })
    },
    async testFnc() {
      let peerInfo = store.state.peerInfo;
      if (peerInfo.hasOwnProperty('local')) {
        let localPeer = peerInfo['local'];
        getStats(localPeer, result => {
          console.warn('======== REPORTS ========');
          console.log('participants count : ', store.state.roomInfo.count, '                 |||   video byte sent/latency/packetloss : ', result.video.bytesSent, result.video.latency, result.video.packetsLost);
          console.log('internal audio delay/packetloss : ', result.internal.audio.prevGoogCurrentDelayMs, result.internal.audio.prevPacketsLost,
            ' |||   internal video delay/packetloss : ', result.internal.video.prevGoogCurrentDelayMs, result.internal.video.prevPacketsLost);
          console.log('## download speed : ', result.bandwidth.speed);
        }, 3000);
        // let sender = localPeer.getSenders();
        // let track;
        // sender.forEach(curr => {
        //   if (curr.track.kind === 'video') track = curr;
        // })
        // if (!track) return;
        // track.getStats().then(r => {
        //   r.forEach(report => {
        //     let bytes;
        //     let packets;
        //     if (report.type === 'outbound-rtp') {
        //       if (report.isRemote) {
        //         return;
        //       }
        //       const now = report.timestamp;
        //       bytes = report.bytesSent;
        //       packets = report.packetsSent;
        //       console.debug('[ local report ] - ', report);
        //       console.debug('local : ', now, packets, bytes);
        //
        //       if (report) {
        //         this.bytes = report.bytesSent - this.report.bytesSent;
        //         this.packets = report.packetsSent - this.report.packetsSent;
        //         console.debug('local diffs : ', this.bytes, this.packets);
        //       }
        //
        //       this.report = JSON.stringify(report);
        //     }
        //   });
        // });
      }
    }
  }
}
</script>
