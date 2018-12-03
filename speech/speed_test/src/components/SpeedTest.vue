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
                                 v-bind:class="{ active: activeAction==='actionVoiceRecognition' }"
                                 v-on:click="actionVoiceRecognitionHandler"
                            >
                                <div class="action__el__inner">voice-recognition</div>
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
    </div>
</template>

<script>
    import Voice from "../utils/voice";
    import SpeechRecognition from "../utils/speechRecognition";

    import CommonVoiceInterfaceRESTAPI from "../utils/commonVoiceInterfaceRESTAPI";
    // import login from "./login";
    // login();

    // import recorderUse from './recorderUse';

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
                    'Smart Voice API-Test (with API speech recognition & API voice)'
                ],
                nr: 1,
                activeAction: '',
                inputContent: 'input-content',
                outputContent: 'output-content',
                actionRequestDuration: '0.0'
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

                var nr = parseInt(window.location.search.slice(1), 10);
                this.cviAPI = new CommonVoiceInterfaceRESTAPI();


                switch (nr) {
                    case 1:
                        this.case1BrowserRecognitionBrowserVoice();
                        break;
                    case 2:
                        this.case2BrowserRecognitionAPIVoice();
                        break;
                }
            });
        },

        methods: {

            case1BrowserRecognitionBrowserVoice() {
                let textPrev = '';

                this.speechRecognitionDisabled = false;

                this.speechRecognition = new SpeechRecognition({
                    onresultCallback: (text, duration) => {
                        console.log("---> onresultCallback text, duration", text, duration);
                        this.$data.inputContent = text;

                    },
                    onspeechendCallback: (text, duration) => {
                        if ( !this.speechRecognitionDisabled ) {
                            if ( text !== '' && text!== 'text-input' && text !== textPrev) {
                                this.cviAPITextToText(text);
                                console.log('>>> onspeechendCallback text:',text,' duration:', duration);
                                this.$data.activeAction = "actionRequest";
                            } else {
                                console.log('>>>>>>>> norequest text', text);
                            }
                            textPrev = text;
                        }

                    },
                    onsoundstartCallback: () => {
                        console.log("onsoundstartCallback");
                    },
                    onstopCallback: () => {
                        this.$data.activeAction = "";
                    }
                });

                this.speechRecognitionStart();

                this.voice = new Voice(() => {
                });


            },

            case2BrowserRecognitionAPIVoice() {

                this.cviAPITextToAudio('Wie ist das Wetter in Frankfurt?');
            },



            actionVoiceRecognitionHandler() {
                console.log('actionVoiceRecognitionHandler this.speechRecognition.active', this.speechRecognition.active);
                if (this.speechRecognition.active) {
                    this.speechRecognition.disabled = true;
                    this.speechRecognitionStop();
                } else {
                    this.speechRecognition.disabled = false;
                    this.speechRecognitionStart();
                }
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
            },

            cviAPITextToText(textInput) {
                this.speechRecognitionStop();
                this.speechRecognitionDisabled = true;
                this.speechRecognition.disabled = true;
                const cviAPIProm = this.cviAPI.request("Text JSON", textInput);
                const startDate = new Date();

                cviAPIProm
                    .then(response => {
                        let text = response.data.text;
                        text = text.replace(/<[^>]+>/g, "");
                        this.$data.outputContent = text;
                        console.log("output-text", text);
                        this.speechRecognitionStop();
                        this.voiceSpeak(text, this.speechRecognitionStart);
                    })
                    .catch(err => {
                        console.log("ERROR", err);
                        const text = "Ich habe Dich leider nicht verstanden!";
                        this.$data.outputContent = text;
                        this.speechRecognitionStop();
                        this.voiceSpeak(text, this.speechRecognitionStart);
                    })
                    .then(() => {
                        const endDate = new Date();
                        const duration = (endDate.getTime() - startDate.getTime()) / 1000;

                        this.$data.actionRequestDuration = duration;
                    });
            },

            cviAPITextToAudio(textInput) {
                const cviAPIProm = this.cviAPI.request('Text Multipart', textInput);
                const startDate = new Date();

                cviAPIProm
                    .then(response => {
                        // let text = response.data.text;
                        // text = text.replace(/<[^>]+>/g, "");
                        // this.$data.outputContent = text;
                        // const audioBlob = new Blob(response.data);
                        // console.log( 'audioBlob', audioBlob );
                        // console.log("output-text", text);
                        // this.voiceSpeak(text, this.speechRecognitionStart);
                        console.log('response.data', response.data );
                    })
                    .catch(err => {
                        console.log("ERROR", err);
                        const text = "Ich habe Dich leider nicht verstanden!";
                        this.$data.outputContent = text;
                        // this.voiceSpeak(text, this.speechRecognitionStart);
                    })
                    .then(() => {
                        const endDate = new Date();
                        const duration = (endDate.getTime() - startDate.getTime()) / 1000;

                        this.$data.actionRequestDuration = duration;
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
