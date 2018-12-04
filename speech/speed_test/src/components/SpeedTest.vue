<template>
    <div class="page">
        <h1 class="title">{{ title[nr-1] }}</h1>
        <div class="main">
            <div class="content-wp">
                <div class="content__el input">
                    <h3 class="content__title">
                        <span class="content__title__inner">input</span>
                    </h3>
                    <div class="content__main input__content">
                        <div class="content__main-inner">{{ inputContent }}</div>
                    </div>
                </div>
                <div class="content__el action">
                    <h3 class="content__title">
                        <span class="content__title__inner">action</span>
                    </h3>
                    <div class="content__main action__main">
                        <div class="content__main-inner">
                            <div class="action__el action__voice-speaks"
                                 v-bind:class="{ active: activeAction==='actionVoiceSpeaks' }">
                                <div class="action__el__inner">voice speaks</div>
                            </div>
                            <div class="action__el action__voice-recog"
                                 v-bind:class="{ active: activeAction==='actionVoiceRecognition' || activeAction ==='actionVoiceRecordingOn' }"
                                 v-on:click="actionVoiceRecognitionHandler"
                            >
                                <div class="action__el__inner">{{ voiceRecognition }}</div>
                            </div>
                            <div class="action__el action__request"
                                 v-bind:class="{ active: activeAction==='actionRequest' }">
                                <div class="action__el__inner">request <span class="action__reques-duration">{{actionRequestDuration}} sec</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content__el output">
                    <h3 class="content__title">
                        <span class="content__title__inner">output</span>
                    </h3>
                    <div class="content__main output__content">{{ outputContent }}</div>
                </div>
            </div>
        </div>
        <select id="voice-select" style="display:none;"></select>


        <button id="audio" style="height:100px;">PLAY</button>
        <!--<audio controls style="height:100px;">-->

            <!--<source id="audiosrc" src="/dummy_data/audio/witz.wav" type="audio/wav">-->

        <!--</audio>-->

        <!--<audio id="audio2" controls style="height:100px;">-->



        <!--</audio>-->
    </div>
</template>

<script>
    // import login from "./login";
    // login();

    import Voice from "../utils/voice";
    // import SpeechRecognition from "../utils/speechRecognition";

    import CommonVoiceInterfaceRESTAPI from "../utils/commonVoiceInterfaceRESTAPI";


    import RecorderUse from './recorderUse';


    // import { parse } from 'multipart-raw-parser'

    import caseBrowserRecognitionBrowserVoice from './caseBrowserRecognitionBrowserVoice';
    import caseBrowserRecognitionAPIVoice from './caseBrowserRecognitionAPIVoice';
    // import caseAPIRecognitionBrowserVoice from './caseAPIRecognitionBrowserVoice';

    export default {
        name: "smartvoice",
        props: {
            msg: String
        },
        data: () => {
            return {
                title: [
                    'Smart Voice API-Test (with browser speech recognition & browser voice)',
                    'Smart Voice API-Test (with browser speech recognition & API voice)',
                    'Smart Voice API-Test (with API speech recognition & browser voice)'
                ],
                nr: 1,
                activeAction: '', // "actionVoiceSpeaks", "actionVoiceRecognition", "actionRequest"
                inputContent: 'input-content',
                outputContent: 'output-content',
                voiceRecognition: 'voice-recognition',
                actionRequestDuration: '0.0'
            };
        },

        mounted() {
            this.$nextTick(() => {

                this.nr = parseInt(window.location.search.slice(1), 10);
                this.cviAPI = new CommonVoiceInterfaceRESTAPI();

                // const text = 'OK, Rewe übernimmt. Das Rezept des Tages für dich ist Süßkartoffelgulasch mit frischen Cranberries. Für dieses Gericht brauchst du circa 45 Minuten und es ist einfach zu kochen. Was brauchst du: die Zutaten oder die Zubereitung?';

                switch (this.nr) {
                    case 1:
                        caseBrowserRecognitionBrowserVoice.call(this);
                        // console.log(caseBrowserRecognitionBrowserVoice);
                        // this.voice = new Voice(() => {
                        //     this.voiceSpeak(text, ()=>{});
                        // });
                        this.voice = new Voice(() => {
                        });
                        break;
                    case 2:
                        this.$data.voiceRecognition = 'record-voice';
                        this.recorderUse = new RecorderUse(this);
                        this.voice = new Voice(() => {
                        });
                        // caseAPIRecognitionBrowserVoice.call(this);
                        break;
                    case 3:
                        caseBrowserRecognitionAPIVoice.call(this);
                        break;
                }
            });
        },

        methods: {

            actionVoiceRecognitionHandler() {
                if (this.nr === 1) {
                    console.log('actionVoiceRecognitionHandler this.speechRecognition.active', this.speechRecognition.active);
                    if (this.speechRecognition.active) {
                        this.speechRecognition.disabled = true;
                        this.speechRecognitionStop();
                    } else {
                        this.speechRecognition.disabled = false;
                        this.speechRecognitionStart();
                    }
                } else {
                    if (this.nr === 3) {
                        if (!this.recorderUse.recording) {
                            this.$data.activeAction = "actionVoiceRecordingOn";
                            this.recorderUse.startRecording();
                        } else {
                            this.$data.activeAction = "actionVoiceRecordingOff";
                            this.recorderUse.stopRecording();

                            // this.recorderUse.stopRecording().then(response => {
                            //     console.log(2, response);
                            // }).catch(err => {
                            //         console.log('ERROR', err);
                            //     }
                            // ).then(function () {
                            //
                            // });

                        }
                    }

                }
            },

            startRecording() {

            },

            stopRecording() {

            },


            speechRecognitionStart() {
                this.speechRecognitionDisabled = false;
                this.speechRecognition.disabled = false;
                this.speechRecognition.start();
                this.$data.activeAction = "actionVoiceRecognition";
            },

            speechRecognitionStop() {
                this.speechRecognition.stop();
                this.$data.activeAction = "";
            },

            voiceSpeak(text, onSpeakEndCallback) {
                this.$data.activeAction = "actionVoiceSpeaks";

                this.voice.speak(text);
                const checkVoice = () => {
                    if (!this.voice.synth.speaking) {
                        if (this.$data.activeAction === "actionVoiceSpeaks") {
                            this.$data.activeAction = "";
                        }
                        onSpeakEndCallback();
                        clearInterval(interval);
                    }
                };
                let interval = setInterval(checkVoice, 200);
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
