// import SpeechRecognition from "../utils/speechRecognition";
// import Voice from "../utils/voice";
import RecorderUse from './recorderUse';

function caseAPIRecognitionBrowserVoice() {
    // const audio ='';
    // this.cviAPIAudioToJSON(audio);
    // recorderUse.startRecording();

    // const cviAudioToJSON = (textInput)=> {
    //     const cviAPIProm = this.cviAPI.request("Audio JSON", textInput);
    //     const startDate = new Date();
    //
    //     cviAPIProm
    //         .then(response => {
    //             let text = response.data.text;
    //             text = text.replace(/<[^>]+>/g, "");
    //             this.$data.outputContent = text;
    //             console.log("output-text", text);
    //             this.voiceSpeak(text, this.speechRecognitionStart);
    //         })
    //         .catch(err => {
    //             console.log("ERROR", err);
    //             const text = "Ich habe Dich leider nicht verstanden!";
    //             this.$data.outputContent = text;
    //             this.voiceSpeak(text, this.speechRecognitionStart);
    //         })
    //         .then(() => {
    //             const endDate = new Date();
    //             const duration = (endDate.getTime() - startDate.getTime()) / 1000;
    //             this.$data.actionRequestDuration = duration;
    //         });
    // }

    this.recorderUse = new RecorderUse();


    // console.log(this.recorderUse, cviAudioToJSON);
}


export default caseAPIRecognitionBrowserVoice;