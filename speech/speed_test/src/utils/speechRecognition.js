class SpeechRecognition {

    constructor(options) {
        this.options = Object.assign({
            onresultCallback: {},
            onspeechendCallback: {},
            onsoundstartCallback: {}
        }, options);
        // this.onresultCallback = this.options.onresultCallback;
        this.resultText = '';

        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            // If false, the recording will stop after a few seconds of silence.
            // When true, the silence period is longer (about 15 seconds),
            // allowing us to keep recording even when the user pauses.
            this.recognition.continuous = true;
            this.recognition.lang = 'de';
            this.recognition.interimResults = false;
        } catch (e) {
            console.error(e);
        }

        this.recognition.onstart = function () {
            console.log('Voice recognition activated. Try speaking into the microphone.');
        }

        this.recognition.onspeechend = () => {
            console.log('You were quiet for a while so voice recognition turned itself off.');
            this.options.onspeechendCallback(this.resultText);
        }

        this.recognition.onerror = (event) => {
            if (event.error == 'no-speech') {
                console.log('No speech was detected. Try again.');
            }
        }

        this.recognition.onsoundstart = () => {
            this.options.onsoundstartCallback();
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
            this.options.onresultCallback(noteContent);

        }
    }

    start() {
        this.recognition.start();
    }

    abort() {
        this.recognition.abort();
    }
}


export default SpeechRecognition;