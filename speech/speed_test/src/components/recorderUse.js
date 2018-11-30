import Recorder from '../vendor/recorder';
import CommonVoiceInterfaceRESTAPI from "./commonVoiceInterfaceRESTAPI";

// Audio format must be
// - Format: wav
// - Sampling rate: 16000 Hz
// - Bit resolution: 16 Bit PCM (little endian pulse code modulation)
// - Audio channels: mono

const recorderUse = function () {
    var gumStream; 						//stream from getUserMedia()
    var rec; 							//Recorder.js object
    var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record

    const recordButton = document.getElementById('record-button');

    recordButton.addEventListener('click', () => {
        // console.log('click');
        if (recordButton.classList.contains('record-not-active')) {
            recordButton.classList.add('record-active');
            recordButton.classList.remove('record-not-active');
            // console.log('start recording');
            startRecording();
        } else {
            recordButton.classList.add('record-not-active');
            recordButton.classList.remove('record-active');
            // console.log('stop recording');
            stopRecording();
        }
    });

    function startRecording() {
        // console.log("recordButton clicked");


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

            /*
                create an audio context after getUserMedia is called
                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                the sampleRate defaults to the one set in your OS for your playback device

            */
            audioContext = new AudioContext();

            /*  assign to gumStream for later use  */
            gumStream = stream;

            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /*
                Create the Recorder object and configure to record mono sound (1 channel)
                Recording 2 channels  will double the file size
            */
            // eslint-disable-next-line
            rec = new Recorder(input, {numChannels: 1})

            //start the recording process
            rec.record();

            console.log("Recording started");

        }).catch(function (err) {
            console.log('err', err);
        });
    }


    function stopRecording() {
        // console.log("stopButton clicked");

        //tell the recorder to stop the recording
        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV((blob)=> {
            // console.log('Blob', blob);

            // exportWAV(blob);

            (() => {
                const cviAPI = new CommonVoiceInterfaceRESTAPI();
                let requestName = 'Audio JSON';
                let requestData = blob;

                const timerDom = document.getElementById('timer-3');
                const textOutputDom = document.getElementById('text-output-3');
                const startDate = new Date();
                const cviAPIProm = cviAPI.request(requestName, requestData);

                cviAPIProm.then(response => {
                    textOutputDom.innerHTML = response.data.text;
                    textOutputDom.style = 'color:green';
                }).catch(err => {
                        console.log('ERROR', requestName, err);
                    }
                ).then(function () {
                    const endDate = new Date();
                    let duration = endDate.getTime() - startDate.getTime();
                    let time = duration / 1000;
                    timerDom.innerHTML = time;
                    timerDom.style = 'color:green';
                });
            })();

        });

    }

    // function exportWAV(blob) {
    //     var url = URL.createObjectURL(blob),
    //         li = document.createElement('li'),
    //         au = document.createElement('audio'),
    //         hf = document.createElement('a');
    //
    //     au.controls = true;
    //     au.src = url;
    //     hf.href = url;
    //     hf.download = '_test__' + new Date().toISOString().replace('T', '-').slice(0, -5) + '.wav';
    //     hf.innerHTML = hf.download;
    //     li.appendChild(au);
    //     li.appendChild(hf);
    //     document.getElementById('downloads').appendChild(li);
    // }


}

export default recorderUse;
