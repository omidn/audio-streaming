import Recorder from '../vendor/recorder';
import CommonVoiceInterfaceRESTAPI from "../utils/commonVoiceInterfaceRESTAPI";

// Audio format must be
// - Format: wav
// - Sampling rate: 16000 Hz
// - Bit resolution: 16 Bit PCM (little endian pulse code modulation)
// - Audio channels: mono

export class RecorderUse {
    recording = false;
    gumStream = null; 						//stream from getUserMedia()
    rec = null; 							//Recorder.js object
    input = null; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = null//audio context to help us record


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
            this.rec = new Recorder(input, {numChannels: 1})

            //start the recording process
            this.rec.record();

            console.log("Recording started");

        }).catch(function (err) {
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

                    cviAPIProm.then(response => {
                        // textOutputDom.innerHTML = response.data.text;
                        // textOutputDom.style = 'color:green';
                        resolve(response);
                        console.log(response);
                    }).catch(err => {
                            console.log('ERROR', requestName, err);
                            reject(err);
                        }
                    ).then(function () {
                        // const endDate = new Date();
                        // let duration = endDate.getTime() - startDate.getTime();
                        // let time = duration / 1000;
                        // timerDom.innerHTML = time;
                        // timerDom.style = 'color:green';
                    });
                })();
            });
        });

        return promise;

    }


}

export default RecorderUse;