<template>
  <div class="modalContent">
    <div class="setting">
      <ul class="select">
        <li>
          <label>Camera</label>
          <select ref="videoInput" @change="onChange" :disabled="this.option.inCall" required>
          </select>
        </li>
        <li>
          <label>Microphone</label>
          <select ref="audioInput" @change="onChange" :disabled="this.option.inCall" required>
          </select>
        </li>
        <li class="speaker">
          <label>Speaker</label>
          <select ref="audioOutput" @change="onChangeOutput($event)" :disabled="this.option.inCall" required>
          </select>
          <button v-bind:class="{ on: isPlayTestSound }" @click="handlePlayTestSound" :disabled="this.option.inCall">테스트</button>
        </li>
      </ul>
    </div>
    <p>{{ contents }}</p>
    <div class="button">
      <button class="cancel" v-if="!this.option.inCall" @click="init">새로고침</button>
      <button class="submit" @click="ok">{{ this.option.inCall ? '확인' : '시작' }}</button>
    </div>
    <div class="modalCheck">
      <div class="checkbox">
        <input id="checkbox" type="checkbox" @change="onChangeCheckbox($event)" v-model="isChecked">
        <label for="checkbox">다음 부터 다시 보지 않기</label>
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
        isPlayTestSound: false,
        outputDeviceId: '', // if you click sound test button.
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
      }
    }
  }
</script>
