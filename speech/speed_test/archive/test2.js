import CommonVoiceInterfaceRESTAPI from './commonVoiceInterfaceRESTAPI';
import LoadAudio from './loadAudio';

const test2 = () => {

    const audioDom = document.getElementById('audio-in');
    const loadAudio = new LoadAudio();
    let url = '/dummy_data/audio/witz.wav';
    url = '/dummy_data/audio/witz_self.wav';
    const loadAudioProm = loadAudio.loadFile(url);


    loadAudioProm.then(response => {
        var blob = new Blob([response.data], {type: 'audio/wav'});
        console.log('blob of wav file', blob);
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        audioCtx.decodeAudioData(response.data, function () {

                (() => {
                    const cviAPI = new CommonVoiceInterfaceRESTAPI();
                    let requestName = 'Audio JSON';
                    let requestData = blob;

                    const timerDom = document.getElementById('timer-2');
                    const textOutputDom = document.getElementById('text-output-2');
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
            },

            function (e) {
                console.log("Error with decoding audio data" + e.err);
            });

        audioDom.innerHTML = response.data;

    }).catch(err => {
            console.log('load audio ERROR', err);
        }
    ).then(function () {
        // console.log('load audio ALWAYS');
    });
};

export default test2;