import SpeechRecognition from "../utils/speechRecognition";
// import Voice from "../utils/voice";

function caseBrowserRecognitionBrowserVoice()  {
    console.log('this', this);
    let textPrev = '';

    this.speechRecognitionDisabled = false;

    this.speechRecognition = new SpeechRecognition({
        onresultCallback: (text, duration) => {
            console.log("---> onresultCallback text, duration", text, duration);
            this.$data.inputContent = text;

        },
        onspeechendCallback: (text, duration) => {
            if (!this.speechRecognitionDisabled) {
                if (text !== '' && text !== 'text-input' && text !== textPrev) {
                    cviAPITextToText(text);
                    console.log('>>> onspeechendCallback text:', text, ' duration:', duration);
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

    // this.voice = new Voice(() => {
    // });


    const cviAPITextToText = (textInput) => {
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
    }
}


export default caseBrowserRecognitionBrowserVoice;