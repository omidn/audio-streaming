<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <h2>Via Common Voice Interface REST API</h2>

    <h3>Sending text via internal webbrowser speech recognition to CVI-API and receive text from CVI-API</h3>
    <div class="container">
      <div class="container__left">
        <h4>Text-Input</h4>
        <textarea id="text-input-1">from browser speech recognition</textarea>
      </div>

      <div class="container__right">
        <h4>Text-Output</h4>
        <textarea id="text-output-1">text-output</textarea>
      </div>
    </div>
    <p class="time-output">
      Time till received text-output:
      <span id="timer-1"></span>
    </p>
    <br>

    <!--<h3>Sending Audio to CVI-API and receive text from CVI-API</h3>-->
    <!--<div class="container">-->
    <!--<div class="container__left">-->
    <!--<h4>Audio-Input</h4>-->
    <!--<textarea id="audio-in">Erzähle mir einen Witz</textarea>-->
    <!--</div>-->
    <!--<div class="container__right">-->
    <!--<h4>Text-Output</h4>-->
    <!--<textarea id="text-output-2">text-output</textarea>-->
    <!--</div>-->
    <!--</div>-->
    <!--<p class="time-output">Time till received text-output: <span id="timer-2"></span></p>-->
    <!--<br>-->
    <!--<h3>Record voice via mic and sending Audio to CVI-API and receive text from CVI-API</h3>-->
    <!--<div class="container">-->
    <!--<div class="container__left">-->
    <!--<h4>Audio-Input</h4>-->
    <!--<textarea id="audio-in-2">Erzähle mir einen Witz</textarea>-->
    <!--</div>-->
    <!--<div class="container__right">-->
    <!--<h4>Text-Output</h4>-->
    <!--<textarea id="text-output-3">text-output</textarea>-->
    <!--</div>-->
    <!--</div>-->
    <!--<p class="time-output">Time till received text-output: <span id="timer-3"></span></p>-->
    <!--<button type="button" id="record-button" class="record-not-active">-->
    <!--<span class="record-not-active__text">start recording</span>-->
    <!--<span class="record-active__text">stop recording</span>-->
    <!--</button>-->
    <!--<br>-->
    <!--<ul id="downloads">-->
    <!--</ul>-->
    <select id="voice-select" style="display:none;"></select>

    <!--<button id="start">START</button>-->
  </div>
</template>

<script>
// import recorderUse from './recorderUse';
import Voice from "../utils/voice";

import SpeechRecognition from "../utils/speechRecognition";
import test1 from "./test1";
// import test2 from './test2';
// import login from "./login";

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      // login();
      // const buttonStart = document.getElementById('start');
      // buttonStart.addEventListener('click', () =>{
      //     // console.log('start');
      //     // const voice = new Voice(()=>{
      //     //     voice.cancel();
      //     //     voice.resume();
      //     //     voice.speak('Hallo');
      //     //     console.log('voice.speak Hallo')
      //     //     // voice.pause();
      //     // });
      //     // console.log('voice',voice);
      // });
      const voice = new Voice(() => {
        // voice.cancel();
        // voice.resume();
        // voice.speak('Hallo, was kann ich für Sie tun?');
        // console.log('voice.speak Hallo')
      });
      console.log("voice", voice);
      const textInput1Dom = document.getElementById("text-input-1");
      let test1Running = false;
      // let speechActive = true;
      const speechRecognition = new SpeechRecognition({
        onResultCallback: text => {
          console.log("onResultCallback text", text);
          textInput1Dom.innerHTML = text;
        },
        onspeechendCallback: text => {
          if (!test1Running) {
            console.log("onspeechendCallback text", text);
            speechRecognition.abort();
            test1Running = true;
            test1({
              text,
              callback: returnedText => {
                voice.cancel();
                voice.resume();
                voice.speak(returnedText);
                console.log("voice speaks", returnedText);

                const _wait = () => {
                  if (!voice.synth.speaking) {
                    speechRecognition.start();
                    clearInterval(interval);
                    test1Running = false;
                  }
                };
                let interval = setInterval(_wait, 200);

                // _wait();
              }
            });
          }
        }
      });
      console.log("speechRecognition", speechRecognition);
      speechRecognition.start();

      // let voice = new Voice(()=>{
      //     // voice.speak('Hallo');
      // });
      // console.log(voice);
      // voice.speak('Hallo Du');
      // test1();
      // test2();
      // recorderUse();
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h4,
h3 {
  margin: 0;
}

h3 {
  text-decoration: underline;
  margin-bottom: 3px;
}
</style>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.container__left,
.container__right {
  padding: 0 10px;
}

.time-output {
  margin: 0;
}

.record-active .record-active__text {
  display: block;
}

.record-active .record-not-active__text {
  display: none;
}

.record-not-active .record-active__text {
  display: none;
}

.record-not-active .record-not-active__text {
  display: block;
}
</style>
