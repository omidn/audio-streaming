export class Voice {
    constructor(onReadyCallback) {
        this.onReadyCallback = onReadyCallback;
        this.synth = window.speechSynthesis;
        // console.log(this.synth);
        this.voiceSelect = document.getElementById('voice-select');
        this.voices = [];
        // this.populateVoiceList();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = this.populateVoiceList.bind(this);
        }
    }

    populateVoiceList() {
        this.voices = this.synth.getVoices().sort(function (a, b) {
            const aname = a.name.toUpperCase(),
                bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            else if (aname == bname) return 0;
            else return +1;
        });
        // console.log('this.voices', this.voices, this.synth);
        var selectedIndex = this.voiceSelect.selectedIndex < 0 ? 0 : this.voiceSelect.selectedIndex;
        this.voiceSelect.innerHTML = '';
        for (let i = 0; i < this.voices.length; i++) {
            var option = document.createElement('option');
            // console.log('this.voices[i].name ',this.voices[i].name );
            option.textContent = this.voices[i].name + ' (' + this.voices[i].lang + ')';

            if (this.voices[i].default) {
                option.textContent += ' -- DEFAULT';
            }

            option.setAttribute('data-lang', this.voices[i].lang);
            option.setAttribute('data-name', this.voices[i].name);
            option.setAttribute('data-index', i);
            if (this.voices[i].lang === 'de-DE') {
                selectedIndex = i;

            }
            this.voiceSelect.appendChild(option);

        }
        this.voiceSelect.selectedIndex = selectedIndex;
        if (this.onReadyCallback) {
            this.onReadyCallback();
        }
    }


    // getTextArray(text) {
    //
    // },


    // !!!chrome has a limit for the length of text to be spoken (Probably 212 chars)
    speak(text) {

        if (this.synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }
        if (text.value !== '') {
            this.synth.cancel();
            this.synth.resume();
            var utterThis = new SpeechSynthesisUtterance(text);
            utterThis.onend = function (event) {
                console.log('SpeechSynthesisUtterance.onend', event);
            }
            utterThis.onerror = function (event) {
                console.error('SpeechSynthesisUtterance.onerror', event);
            }
            // var selectedOption = this.voiceSelect.selectedOptions[0].getAttribute('data-name');
            // for(let i = 0; i < this.voices.length ; i++) {
            //     if(this.voices[i].name === selectedOption) {
            //         utterThis.voice = this.voices[i];
            //     }
            // }
            // utterThis.pitch = pitch.value;
            // utterThis.rate = rate.value;

            utterThis.voice = this.voices[this.voiceSelect.selectedIndex];
            this.synth.speak(utterThis);

        }
    }

    cancel() {
        this.synth.cancel();
    }

    pause() {
        this.synth.pause();
        console.log('voice pause')
    }

    resume() {
        this.synth.resume();
        console.log('voice resume');
    }




}



export default Voice