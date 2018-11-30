class SpeechRecognition {

    constructor(options) {
        this.options = Object.assign({onResultCallback:{}}, options);
        this.onResultCallback = this.options.onResultCallback;
        this.resultText = '';

        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            // If false, the recording will stop after a few seconds of silence.
            // When true, the silence period is longer (about 15 seconds),
            // allowing us to keep recording even when the user pauses.

            this.recognition.continuous = false;
            this.recognition.lang = 'de';
            this.recognition.interimResults = true;
        }
        catch (e) {
            console.error(e);
        }

        this.recognition.onstart = function () {
            console.log('Voice recognition activated. Try speaking into the microphone.');
        }

        this.recognition.onspeechend = ()=> {
            console.log('You were quiet for a while so voice recognition turned itself off.');
            this.options.onspeechendCallback(this.resultText);
        }

        this.recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                console.log('No speech was detected. Try again.');
            }
        }

        // This block is called every time the Speech APi captures a line.
        this.recognition.onresult = (event) => {

            // event is a SpeechRecognitionEvent object.
            // It holds all the lines we have captured so far.
            // We only need the current one.
            var current = event.resultIndex;

            // Get a transcript of what was said.
            var transcript = event.results[current][0].transcript;


            const noteContent = transcript;
            // console.log('noteContent', noteContent);

            // noteTextarea.val(noteContent);

            // var last = event.results.length - 1;
            // var color = event.results[last][0].transcript;
            this.resultText = noteContent;
            this.options.onResultCallback(noteContent);

        }
    }

    start() {
        this.recognition.start();
    }


}


export default SpeechRecognition;