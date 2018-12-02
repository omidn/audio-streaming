<template>
  <div class="page">
    <h1 class="title">{{ msg }}</h1>

    <div class="main">
      <div class="content-wp">
        <div class="content__el input">
          <h3 class="content__title">
            <span class="content__title__inner">input</span>
          </h3>
          <div class="content__main input__content" ref="inputContent">
            <div class="content__main-inner">input-content</div>
          </div>
        </div>
        <div class="content__el action">
          <h3 class="content__title">
            <span class="content__title__inner">action</span>
          </h3>
          <div class="content__main action__main">
            <div class="content__main-inner">
              <div
                class="action__el action__voice-speaks"
                v-bind:class="{ active: activeAction==='actionVoiceSpeaks' }"
                ref="actionVoiceSpeaks"
              >
                <div class="action__el__inner">voice speaks</div>
              </div>
              <div
                class="action__el action__voice-recog"
                v-bind:class="{ active: activeAction==='actionVoiceRecognition' }"
                ref="actionVoiceRecog"
              >
                <div class="action__el__inner">voice-recognition</div>
              </div>
              <div
                class="action__el action__request"
                v-bind:class="{ active: activeAction==='actionRequest' }"
                ref="actionRequest"
              >
                <div class="action__el__inner">
                  request
                  <span class="action__reques-duration">
                    <span ref="actionRequestDuration">0.0</span>sec
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content__el output">
          <h3 class="content__title">
            <span class="content__title__inner">output</span>
          </h3>
          <div class="content__main output__content" ref="outputContent">output-content</div>
        </div>
      </div>
    </div>
    <select id="voice-select" style="display:none;"></select>
  </div>
</template>

<script>
import Voice from "../utils/voice";
import SpeechRecognition from "../utils/speechRecognition";

import CommonVoiceInterfaceRESTAPI from "../utils/commonVoiceInterfaceRESTAPI";
// import login from "./login";
// login();

export default {
  name: "smartvoice",
  props: {
    msg: String
  },
  data: () => {
    return {
      activeAction: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs);
      // console.log(this);
      // this.$data.activeAction = "actionVoiceSpeaks";
      // this.$data.activeAction = "actionVoiceRecognition";
      // this.$data.activeAction = "actionRequest";
      console.log(this.$data.activeAction);
      this.init();
    });
  },

  created() {
    // console.log("created", this);
  },

  methods: {
    init() {
      this.cviAPI = new CommonVoiceInterfaceRESTAPI();

      this.speechRecognition = new SpeechRecognition({
        onresultCallback: text => {
          console.log("onresultCallback text", text);
          this.$refs.inputContent.innerHTML = text;
        },
        onspeechendCallback: text => {
          this.cviAPITextToText(text);
          console.log(">>> onspeechendCallback text", text);
          // this.$data.activeAction = "";
          this.$data.activeAction = "actionRequest";
        },
        onsoundstartCallback: () => {
          console.log("onsoundstartCallback");
          // speechRecognition.start();
          // this.$data.activeAction = "actionVoiceRecognition";
        },
        onstopCallback: () => {
          this.$data.activeAction = "";
        }
      });
      this.speechRecognitionStart();

      this.voice = new Voice(() => {
        // const onSpeakEndCallback = () => {
        //   console.log("onSpeakEndCallback");
        //   speechRecognition.start();
        // };<
      });
      // this.voiceSpeak("Hallo, was kann ich für Sie tun?", onSpeakEndCallback);
      // console.log('voice.speak Hallo')
    },

    speechRecognitionStart() {
      this.speechRecognition.start();
      this.$data.activeAction = "actionVoiceRecognition";
    },

    voiceSpeak(text, onSpeakEndCallback) {
      this.$data.activeAction = "actionVoiceSpeaks";

      this.voice.speak(text);
      const checkVoice = () => {
        if (!this.voice.synth.speaking) {
          if (this.$data.activeAction === "actionVoiceSpeaks") {
            this.$data.activeAction = "";
          }
          clearInterval(interval);
          onSpeakEndCallback();
        }
      };
      let interval = setInterval(checkVoice, 200);
    },

    cviAPITextToText(textInput) {
      const cviAPIProm = this.cviAPI.request("Text JSON", textInput);
      const startDate = new Date();

      cviAPIProm
        .then(response => {
          let text = response.data.text;
          text = text.replace(/<[^>]+>/g, "");
          this.$refs.outputContent.innerHTML = text;
          console.log("output-text", text);
          // onsoundstartCallback: () => {
          //   console.log("onsoundstartCallback");
          //   this.speechRecognitionStart();
          // };
          this.voiceSpeak(text, this.speechRecognitionStart);
        })
        .catch(err => {
          console.log("ERROR", err);
          const text = "Ich habe Dich leider nicht verstanden!";
          this.$refs.outputContent.innerHTML = text;
          this.voiceSpeak(text, this.speechRecognitionStart);
        })
        .then(() => {
          const endDate = new Date();
          const duration = (endDate.getTime() - startDate.getTime()) / 1000;

          this.$refs.actionRequestDuration.innerHTML = duration;
        });
    }
  }
};
</script>


<style scoped lang="scss">
.page {
  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 100vh;
  padding: 20px 15px;
}

.title {
  margin: 0 0 10px;
  padding: 10px;
  border-radius: 10px;
  font-size: 26px;
  background: pink;
}

.main {
  display: flex;
  justify-content: center;

  height: 90vh;
}

.content-wp {
  display: flex;
  justify-content: center;

  width: 100%;

  background: lightgoldenrodyellow;
}

.content__el {
  border-radius: 10px;
  padding: 10px;

  &:nth-child(2) {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.content__title {
  display: flex;
  justify-content: center;
  flex-direction: column;

  position: relative;
  width: 100%;
  height: 10%;
  margin: 0;
  // padding: 20px;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background: white;
  }
}

.content__title__inner {
  font-size: 25px;
  position: relative;
}
.content__main {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 90%;
}

.content__main-inner {
  // height: 100%;
}

.input,
.output {
  font-size: 40px;
  font-weight: bold;
}

.input {
  width: 40%;
  background: lightgreen;
}

.output {
  width: 40%;
  background: lightsteelblue;
}

.action {
  width: 20%;
  background: lightsalmon;
}

.action__main {
  display: flex;
  justify-content: center;
  flex-direction: column;

  // height: 100%;
  // padding: 10px 0;

  // background: lightgrey;
  .content__main-inner {
    height: 100%;
  }
}

.action__el {
  display: flex;
  justify-content: center;
  flex-direction: column;

  height: 33.33%;

  &.active {
    // background: lightgoldenrodyellow;
    position: relative;
    font-weight: bold;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: white;
      animation: blink 1500ms ease-in-out infinite;
      border-radius: 4px;
      border: 2px solid red;
    }
  }
}

.action__el__inner {
  position: relative;
}

.action__reques-duration {
  font-size: 15px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  background: lightcyan;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
