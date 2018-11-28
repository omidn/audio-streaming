import CommonVoiceInterfaceRESTAPI from './commonVoiceInterfaceRESTAPI';
import LoadAudio from './loadAudio';

const test2 =() => {
    // const timerDom = document.getElementById('timer2');
    const audioDom = document.getElementById('audio-in');
    // const startDate = new Date();
    const loadAudio = new LoadAudio();
    let url = '/dummy_data/audio/witz.wav';
    const loadAudioProm = loadAudio.loadFile(url);


    loadAudioProm.then(response => {
        console.log('loadAudio response', response.data, typeof response.data);

        var blob = new Blob([response.data], {type: 'audio/wav'});
        console.log('### blob', blob, typeof blob);


        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // var source = audioCtx.createBufferSource();
        audioCtx.decodeAudioData(response.data, function (buffer) {
                console.log('###buffer', buffer, typeof buffer);
                // source.buffer = buffer;
                //
                // source.connect(audioCtx.destination);
                // source.loop = true;

                (() => {
                    const cviAPI = new CommonVoiceInterfaceRESTAPI();
                    let requestName = 'Audio JSON';
                    let requestData;// = {'data-binary': buffer};
                    requestData = buffer;
                    // requestData = response.data;
                    requestData = blob;
                    // requestData = {'data-binary': 'blob'};
                    // requestData = '';
                    const timerDom = document.getElementById('timer');
                    const startDate = new Date();
                    const cviAPIProm = cviAPI.request(requestName, requestData);

                    cviAPIProm.then(response => {
                        console.log('response', requestName, response);
                    }).catch(err => {
                            console.log('ERROR', requestName, err);
                        }
                    ).then(function () {
                        console.log('ALWAYS');
                        const endDate = new Date();
                        let duration = endDate.getTime() - startDate.getTime();
                        let time = duration / 1000;
                        timerDom.innerHTML = time;
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
        console.log('load audio ALWAYS');
    });
};

export default test2;