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
        <li>
          <label>Speaker</label>
          <select ref="audioOutput" :disabled="this.option.inCall" required>
          </select>
        </li>
      </ul>
    </div>
    <br />
    <p>{{ contents }}</p>
    <div class="button">
      <button class="submit" @click="ok">{{ this.option.inCall ? '확인' : '시작' }}</button>
    </div>
    <div class="modalCheck">
      <div class="checkbox">
        <input id="checkbox" type="checkbox" @change="onChangeCheckbox($event)" v-model="isChecked">
        <label for="checkbox">입장 시 다시 보지 않기</label>
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
        video: false,
        audio: false,
      }
    },
    mounted() {
      this.isChecked = window.localStorage.getItem('IS_CHECKED_DEVICE') ? JSON.parse(window.localStorage.getItem('IS_CHECKED_DEVICE').toLowerCase()) : false;

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
      }

      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          const audioInput = this.$refs.audioInput;
          const audioOutput = this.$refs.audioOutput;
          const videoInput = this.$refs.videoInput;

          for (let i = 0; i !== devices.length; ++i) {
            const deviceInfo = devices[i];
            const option = document.createElement("option");
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === "audioinput") {
              option.text = deviceInfo.label || `microphone ${audioInput.length + 1}`;
              audioInput.appendChild(option);
            } else if (deviceInfo.kind === "audiooutput") {
              option.text = deviceInfo.label || `speaker ${audioOutput.length + 1}`;
              audioOutput.appendChild(option);
            } else if (deviceInfo.kind === "videoinput") {
              option.text = deviceInfo.label || `camera ${videoInput.length + 1}`;
              videoInput.appendChild(option);
            } else {
              console.log("Some other kind of source/device: ", deviceInfo);
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    methods: {
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
      onChangeCheckbox(e) {
        window.localStorage.setItem('IS_CHECKED_DEVICE', e.target.checked);
        this.isChecked = e.target.checked;
      }
    }
  }
</script>
