<template>
  <div class="modalContent">
    <div class="setting">
      <ul class="select">
        <li>
          <label>Camera</label>
          <select ref="videoInput" @change="onChange" :disabled="this.option.inCall" required>
          </select>
        </li>
        <li v-bind:class="{ mic: !this.option.inCall }">
          <label>Microphone</label>
          <select ref="audioInput" @change="onChange" :disabled="this.option.inCall" required>
            <option value="">기본값 - 외장 마이크(Conexant ISST Audio)</option>
            <option value="">Microphone1</option>
            <option value="">Microphone2</option>
          </select>
          <div class="volume" v-bind:class="{ none: !isPlayTestMic }">
            <div class="percent" v-bind:style="volumeHeight">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </li>
        <li v-bind:class="{ speaker: !this.option.inCall }">
          <label>Speaker</label>
          <select ref="audioOutput" @change="onChangeOutput($event)" :disabled="this.option.inCall" required>
          </select>
          <button v-if="!this.option.inCall" v-bind:class="{ on: isPlayTestSound }" @click="handlePlayTestSound" :disabled="this.option.inCall">테스트</button>
        </li>
      </ul>
    </div>
    <p>{{ contents }}</p>
    <div class="button">
      <button class="cancel" v-if="!this.option.inCall" @click="init">{{ this.$t('popup-refresh') }}</button>
      <button class="submit" @click="ok">{{ this.option.inCall ? this.$t('popup-submit') : this.$t('popup-start') }}</button>
    </div>
    <div class="modalCheck">
      <div class="checkbox">
        <input id="checkbox" type="checkbox" @change="onChangeCheckbox($event)" v-model="isChecked">
        <label for="checkbox">{{ $t('popup-checkbox-1') }}</label>
      </div>
    </div>
  </div>
</template>

<script>
  import { eBus } from '../../commons/eventBus';
  import store from "../../store";

  export default {
    props: { contents: String, ok: Function, option: Object },
    data() {
      return {
        isChecked: false,
        isPlayTestMic: false,
        isPlayTestSound: false,
        outputDeviceId: '', // if you click sound test button.
        meter: null,
        volumeHeight: ''
      }
    },
    mounted() {
      // local mic on
      eBus.$emit('setVideo', {
        type: 'set',
        id: 'local',
        deviceSetting: {
          done: false
        }
      });

      // 다시 보지 않기
      this.isChecked = window.localStorage.getItem('IS_CHECKED_DEVICE') ? JSON.parse(window.localStorage.getItem('IS_CHECKED_DEVICE').toLowerCase()) : false;
      this.init();

      if (this.option.inCall) {
        const audioInput = this.$refs.audioInput;
        const videoInput = this.$refs.videoInput;
        store.state.streamInfo.local.getTracks().forEach(curr => {
          const option = document.createElement("option");
          option.value = curr.id;
          option.text = curr.label;
          if (curr.kind === 'audio') audioInput.appendChild(option);
          if (curr.kind === 'video') videoInput.appendChild(option);
        })

        if (!this.$refs.audioOutput.hasChildNodes()) {
          navigator.mediaDevices.enumerateDevices()
            .then(devices => {
              devices.forEach(curr => {
                if (curr.deviceId === 'default' && curr.kind === 'audiooutput') {
                  const option = document.createElement("option");
                  option.value = curr.id;
                  option.text = curr.label;
                  this.$refs.audioOutput.appendChild(option)
                }
              })
            })
        }
      }
    },
    methods: {
      init() {
        const audioInput = this.$refs.audioInput;
        const audioOutput = this.$refs.audioOutput;
        const videoInput = this.$refs.videoInput;
        this.outputDeviceId = store.state.userInfo.sinkId ? store.state.userInfo.sinkId : '';

        while (audioInput.hasChildNodes()) audioInput.removeChild(audioInput.firstChild);
        while (audioOutput.hasChildNodes()) audioOutput.removeChild(audioOutput.firstChild);
        while (videoInput.hasChildNodes()) videoInput.removeChild(videoInput.firstChild);

        navigator.mediaDevices
          .enumerateDevices()
          .then(devices => {
            for (let i = 0; i !== devices.length; ++i) {
              const deviceInfo = devices[i];
              const option = document.createElement("option");
              option.value = deviceInfo.deviceId;
              if (deviceInfo.kind === "audioinput") {
                option.text = deviceInfo.label || `microphone ${audioInput.length + 1}`;
                if (!this.option.inCall) audioInput.appendChild(option);
              } else if (deviceInfo.kind === "audiooutput") {
                option.text = deviceInfo.label || `speaker ${audioOutput.length + 1}`;
                if (!this.option.inCall || this.option.inCall && this.outputDeviceId === deviceInfo.deviceId) audioOutput.appendChild(option);
              } else if (deviceInfo.kind === "videoinput") {
                option.text = deviceInfo.label || `camera ${videoInput.length + 1}`;
                if (!this.option.inCall) videoInput.appendChild(option);
              } else {
                console.log("Some other kind of source/device: ", deviceInfo);
              }

              if (i === devices.length - 1 && !this.option.inCall) {
                // 새로고침 시 default 데이터로 변경
                this.onChange();
                this.onChangeOutput();
              }
            }
          })
          .catch(e => {
            console.error(e);
          });
      },
      onChange() {
        const audioInput = this.$refs.audioInput.value;
        const videoInput = this.$refs.videoInput.value;

        navigator.mediaDevices.getUserMedia({
          audio: audioInput ? { deviceId: { exact: audioInput } } : false,
          video: videoInput ? { deviceId: { exact: videoInput } } : false
        })
          .then(stream => {
            store.commit('setStreamInfo', { local: stream });
            this.checkMic();

            eBus.$emit('video', {
              type: 'set',
              id: 'local',
              deviceSetting: {
                stream,
                done: false
              }
            })
          })
          .catch(err => { console.error(err) });
      },
      onChangeOutput(e) {
        this.outputDeviceId = e ? e.target.value : 'default';
        store.commit('setUserInfo', { sinkId: this.outputDeviceId });
        eBus.$emit('video', {
          type: 'set',
          id: 'local',
          deviceSetting: {
            sinkId: this.outputDeviceId,
            done: false
          }
        })
      },
      onChangeCheckbox(e) {
        window.localStorage.setItem('IS_CHECKED_DEVICE', e.target.checked);
        this.isChecked = e.target.checked;
      },
      async handlePlayTestSound() {
        if (!this.isPlayTestSound) {
          this.isPlayTestSound = true;
          const audio = document.createElement('audio');
          await audio.setSinkId(this.outputDeviceId);
          audio.src = `/static/audio/harp_run_${Math.floor(Math.random() * 2) + 1}.wav`;
          audio.onended = () => {
            audio.remove();
            this.isPlayTestSound = false;
          }
          await audio.play();
        }
      },
      checkMic() {
        let audioContext = new AudioContext();
        let mediaStreamSource = audioContext.createMediaStreamSource(store.state.streamInfo.local);
        this.meter = createAudioMeter(audioContext);
        mediaStreamSource.connect(this.meter);
        this.onLevelChange();

        function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
          var processor = audioContext.createScriptProcessor(512);
          processor.onaudioprocess = volumeAudioProcess;
          processor.clipping = false;
          processor.lastClip = 0;
          processor.volume = 0;
          processor.clipLevel = clipLevel || 0.98;
          processor.averaging = averaging || 0.95;
          processor.clipLag = clipLag || 750;

          // this will have no effect, since we don't copy the input to the output,
          // but works around a current Chrome bug.
          processor.connect(audioContext.destination);

          processor.checkClipping =
            function(){
              if (!this.clipping)
                return false;
              if ((this.lastClip + this.clipLag) < window.performance.now())
                this.clipping = false;
              return this.clipping;
            };

          processor.shutdown =
            function(){
              this.disconnect();
              this.onaudioprocess = null;
            };

          return processor;
        }

        function volumeAudioProcess( event ) {
          var buf = event.inputBuffer.getChannelData(0);
          var bufLength = buf.length;
          var sum = 0;
          var x;

          // Do a root-mean-square on the samples: sum up the squares...
          for (var i=0; i<bufLength; i++) {
            x = buf[i];
            if (Math.abs(x)>=this.clipLevel) {
              this.clipping = true;
              this.lastClip = window.performance.now();
            }
            sum += x * x;
          }

          // ... then take the square root of the sum.
          var rms =  Math.sqrt(sum / bufLength);

          // Now smooth this out with the averaging factor applied
          // to the previous sample - take the max here because we
          // want "fast attack, slow release."
          this.volume = Math.max(rms, this.volume*this.averaging);
        }
      },
      onLevelChange(time) {
        let volume = this.meter.volume * 100;
        this.isPlayTestMic = volume > 1;
        this.volumeHeight = `height:${volume * 2}%`;
        // if (volume > 1) console.log(volume);

        // set up the next callback
        let rafID = window.requestAnimationFrame(this.onLevelChange);
      }
    }
  }
</script>
