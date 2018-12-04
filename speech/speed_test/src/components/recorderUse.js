import Recorder from '../vendor/recorder';
import CommonVoiceInterfaceRESTAPI from "../utils/commonVoiceInterfaceRESTAPI";
// import Voice from "../utils/voice";

// Audio format must be
// - Format: wav
// - Sampling rate: 16000 Hz
// - Bit resolution: 16 Bit PCM (little endian pulse code modulation)
// - Audio channels: mono

export class RecorderUse {


    constructor(thisMain) {
        this.recording = false;
        this.gumStream = null; 						//stream from getUserMedia()
        this.rec = null; 							//Recorder.js object
        this.input = null; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
//         this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = null//audio context to help us record

        this.thisMain = thisMain;
        // this.voice = new Voice(() => {
        // });
    }


    startRecording() {

        /*
            Simple constraints object, for more advanced audio features see
            https://addpipe.com/blog/audio-constraints-getusermedia/
        */

        var constraints = {audio: true, video: false}

        /*
            We're using the standard promise based getUserMedia()
            https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
            this.recording = true;
            /*
                create an audio context after getUserMedia is called
                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                the sampleRate defaults to the one set in your OS for your playback device

            */
            this.audioContext = new AudioContext();

            /*  assign to gumStream for later use  */
            this.gumStream = stream;

            /* use the stream */
            this.input = this.audioContext.createMediaStreamSource(stream);

            /*
                Create the Recorder object and configure to record mono sound (1 channel)
                Recording 2 channels  will double the file size
            */
            // eslint-disable-next-line
            this.rec = new Recorder(this.input, {numChannels: 1})

            //start the recording process
            this.rec.record();

            console.log("Recording started");

        }.bind(this)).catch(function (err) {
            console.log('err', err);
        });
    }


    stopRecording() {
        this.recording = false;
        // console.log("stopButton clicked");

        //tell the recorder to stop the recording
        this.rec.stop();

        //stop microphone access
        this.gumStream.getAudioTracks()[0].stop();

        const startDate = new Date();

        var promise = new Promise((resolve, reject)=> {
            //create the wav blob and pass it on to createDownloadLink
            this.rec.exportWAV((blob)=> {
                // console.log('Blob', blob);

                // exportWAV(blob);

                (() => {
                    const cviAPI = new CommonVoiceInterfaceRESTAPI();
                    let requestName = 'Audio JSON';
                    let requestData = blob;

                    // const timerDom = document.getElementById('timer-3');
                    // const textOutputDom = document.getElementById('text-output-3');
                    // const startDate = new Date();
                    const cviAPIProm = cviAPI.request(requestName, requestData);

                    cviAPIProm.then(function(response){
                        let text = response.data.text;
                        text = text.replace(/<[^>]+>/g, "");
                        this.thisMain.$data.outputContent = text;
                        console.log("output-text", text);
                        resolve(response);
                        this.thisMain.voiceSpeak(text, ()=>{});
                        // console.log(response);
                    }.bind(this)).catch(err => {
                            console.log('ERROR', requestName, err);
                            reject(err);
                        }
                    ).then(function () {
                        const endDate = new Date();
                        const duration = (endDate.getTime() - startDate.getTime()) / 1000;

                        this.thisMain .$data.actionRequestDuration = duration;
                    }.bind(this));
                })();
            });
        });

        return promise;

    }


}

export default RecorderUse;