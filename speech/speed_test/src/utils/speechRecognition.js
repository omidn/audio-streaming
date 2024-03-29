class SpeechRecognition {

    constructor(options) {
        this.options = Object.assign({
            onresultCallback: {},
            onspeechendCallback: {},
            onsoundstartCallback: {},
            onstopCallback: {},
            timeTillStopRecognition: 5000
        }, options);

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
            this.disabled = false;
        } catch (e) {
            console.error(e);
        }

        this.recognition.onstart = function () {
            console.log('Voice recognition activated. Try speaking into the microphone.');
        }

        this.recognition.onspeechend = () => {
            console.log('### You were quiet for a while so voice recognition turned itself off.');
            const endDate = new Date();
            let duration = (endDate.getTime() - this.startDate.getTime());
            this.options.onspeechendCallback(this.resultText, duration);
        }

        this.recognition.onend = () => {
            console.log('### Speech recognition service disconnected');
            const endDate = new Date();
            let duration = (endDate.getTime() - this.startDate.getTime()) / 1000;
            console.log('duration',duration, 'timeTillStopRecognition',this.options.timeTillStopRecognition);
            this.active = false;
            if (duration >= this.options.timeTillStopRecognition ) {

                this.stop();
                this.options.onstopCallback();
            } else {
                this.start();
            }
        }

        this.recognition.onstop = () => {
            console.log('Speech recognition service stopped');
        }

        this.recognition.onerror = (event) => {
            if (event.error == 'no-speech') {
                console.log('No speech was detected. Try again.');
            }
        }

        this.recognition.onsoundstart = () => {
            console.log('Speech recognition onsoundstart');
            this.options.onsoundstartCallback();
        }


        // This block is called every time the Speech APi captures a line.
        this.recognition.onresult = (event) => {
            console.log('Speech recognition onresult');

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
            const endDate = new Date();
            let duration = (endDate.getTime() - this.startDate.getTime());
            this.options.onresultCallback(noteContent, duration);
            this.startDate = new Date();
        }
    }

    start() {
        if ( !this.disabled ) {
            console.log('####### Speech recognition start');
            if (!this.active) {
                this.recognition.start();
                this.startDate = new Date();
                this.active = true;
            }
        }

    }

    stop() {
        console.log('Speech recognition stop');
        this.recognition.stop();
        this.active = false;
    }

    abort() {
        console.log('Speech recognition abort');
        this.recognition.abort();
        this.active = false;
    }
}


export default SpeechRecognition;