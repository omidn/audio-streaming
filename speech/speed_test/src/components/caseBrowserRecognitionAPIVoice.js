// import SpeechRecognition from "../utils/speechRecognition";
// import Voice from "../utils/voice";
var multipart = require('parse-multipart');
import { Base64 } from 'js-base64';
// const save = require('save-file');


function caseBrowserRecognitionAPIVoice() {

    const cviAPITextToAudio = (textInput)=> {

        // console.log(multipart.DemoData(), textInput);
        // // var body = response.data;
        // var body = multipart.DemoData();
        // var boundary = "--KIjp6OAB_uP855gbxNVVA8RYOAX7eB";
        // boundary = "----WebKitFormBoundaryvef1fLxmoUdYZWXp";
        // boundary = "----WebKitFormBoundaryvef1fLxmoUdYZWXp";
        // var parts = multipart.Parse(body,boundary);
        // console.log('parts', parts);
        //
        // for(var i=0;i<parts.length;i++){
        //     var part = parts[i];
        //     // will be:
        //     // { filename: 'A.txt', type: 'text/plain',
        //     //		data: <Buffer 41 41 41 41 42 42 42 42> }
        //     console.log('part',part);
        // }

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
                console.log('response.data', response, typeof response.data );
                // const multipartDataArray = parse(response.data, response.headers.get('Content-Type'))
                // console.log('multipartDataArray',multipartDataArray);
                // //
                //
                //
                //
                var body = response.data;
                var marker = 'Content-Type: audio/l16;rate=16000';
                var n = body.indexOf(marker) + marker.length;
                var blockAudio = body.substring(n, body.length);
                var boundary = '--'+multipart.getBoundary(response.headers['content-type'])+'--';
                n = body.indexOf(boundary);
                blockAudio = blockAudio.substring(0, n-boundary.length);
                var myblob = new Blob([blockAudio], {
                    // type: 'audio/l16'
                    type: 'audio/wav'
                });

                // console.log(new FormData(response.data));

                // console.log('blockAudio', blockAudio);
                console.log('blob', myblob);



                const audioUrl = URL.createObjectURL(myblob);
                const audio = new Audio(audioUrl);

                const audioDom = document.getElementById('audio');
                // const audioDom2 = document.getElementById('audio');
                // const audiosrcDom = document.getElementById('audiosrc');
                var base64 = 'data:audio/l16;base64,'+ Base64.encode(blockAudio);
                base64 = 'data:audio/wav;base64,'+ Base64.encode(blockAudio);
                // audiosrcDom.setAttribute('src', base64);

                // save(myblob, 'blobsave.wav');


                var x = document.createElement("AUDIO");
                x.setAttribute("src",base64);
                x.setAttribute("controls", "controls");
                document.body.appendChild(x);

                // console.log('audioDom ', audioDom );
                // console.log('base64', base64);
                audioDom.addEventListener("click", () => {
                    console.log('click');
                    audio.play();
                });


                // const fileReader = new FileReader();
                // fileReader.onload = function (evt) {
                //     var result = evt.target.result;
                //     console.log('result', result);
                // };
                // Load blob as Data URL
                // fileReader.readAsBinaryString(response.data);


                // // var boundary = body.substring(2, n);
                //     // var boundary = "--KIjp6OAB_uP855gbxNVVA8RYOAX7eB";
                // // boundary = "KIjp6OAB_uP855gbxNVVA8RYOAX7eB";

                // var parts = multipart.Parse(body,boundary);
                // console.log('parts', parts, boundary);

                // for(var i=0;i<parts.length;i++){
                //     var part = parts[i];
                //     // will be:
                //     // { filename: 'A.txt', type: 'text/plain',
                //     //		data: <Buffer 41 41 41 41 42 42 42 42> }
                //     console.log('part',part);
                // }




                // const audioBlob = new Blob(response.data);
                // console.log( 'audioBlob', audioBlob )

                // var decodedData = window.atob(response.data);
                // console.log('decodedData',decodedData);

                // var myBlob = new Blob(response.data, {type : "text/plain"});
                // console.log('myBlob', myBlob);
                // const audioBlob = new Blob(response.data);
                // console.log( 'audioBlob', audioBlob );
                // const audioUrl = URL.createObjectURL(audioBlob);
                // const audio = new Audio(audioUrl);
                // audio.play();
                // const audioContext = new AudioContext();
                // let startTime = 0;
                // audioContext.decodeAudioData(response.data, function(buffer) {
                //     var source = audioContext.createBufferSource();
                //     source.buffer = buffer;
                //     source.connect(audioContext.destination);
                //
                //     source.start(startTime);
                //     startTime += buffer.duration;
                // });
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

    cviAPITextToAudio('Wie ist das Wetter in Frankfurt?');
}


export default caseBrowserRecognitionAPIVoice;