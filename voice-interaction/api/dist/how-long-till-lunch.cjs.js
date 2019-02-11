'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lowerCase = _interopDefault(require('lodash/lowerCase'));
var noop = _interopDefault(require('lodash/noop'));
var extend = _interopDefault(require('lodash/extend'));

const defaults = {
  interimResults: false,
  continuous: true,
  lang: 'en-US',
  maxAlternatives: 3,
  onResult: noop,
};

function webSpeechApi (opt) {
  const options = extend(defaults, opt);
  const recognition = new webkitSpeechRecognition();
  
  if (opt.commands) {
    const commands = options.commands;
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${Object.keys(commands).map(x => lowerCase(x)).join(' | ')} ;`;
    const list = new webkitSpeechGrammarList();
    list.addFromString(grammar, 1);
    recognition.grammars = list;
  }

  recognition.continuous = options.continuous;
  recognition.interimResults = options.interimResults;
  recognition.lang = options.lang;
  recognition.maxAlternatives = options.maxAlternatives;

  const start = () => {
    recognition.start();
    console.log('started recording');
  };
  
  const stop = () => {
    recognition.stop();
    console.log('stopped recording');
  };

  recognition.onresult = function(e) {
    const msg = e.results[e.results.length - 1];
    
    if (options.onResult) {
      options.onResult(msg);
    }
  };
  
  recognition.onerror = function(event) {
    console.log(event.error);
  };
  
  return {
    start,
    stop,
  }
}

var recorder = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContex;
  const audioContext = audioContext || new AudioContext();

  let onResult = null, inputPoint = null, stream = null, microphone = null, analyser = null,  scriptProcessor = null;
  
  const startRecording = (onResult, callback) => {
    if (!audioContext) {
      return;
    }
    
    // define the audio graph
    inputPoint = audioContext.createGain();
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    scriptProcessor = inputPoint.context.createScriptProcessor(2048, 1, 1);
    

    // actually start recording, the converse is to disconnect() microphone and recording should stop
    microphone.connect(inputPoint);
    inputPoint.connect(analyser);
    inputPoint.connect(scriptProcessor);
    scriptProcessor.connect(inputPoint.context.destination);
    
	  // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
	  scriptProcessor.addEventListener('audioprocess', streamAudioData);
  };


  const streamAudioData = (e) => {
    // onResult(downSampleBuffer(e.inputBuffer.getChannelData(0), audioContext.sampleRate, 16000)); // Usually, 44100 -> 16000
    const floatSamples = e.inputBuffer.getChannelData(0);
    onResult(Int16Array.from(floatSamples.map(n => n * 0x7FFF)).buffer);
  };
  
  // start recording 
  const start = (func) => {
    onResult = func;
    // try to start recording audio
    navigator.mediaDevices.getUserMedia({
	    audio: {
	      mandatory: {
		      googEchoCancellation: 'false',
		      googAutoGainControl: 'false',
		      googNoiseSuppression: 'false',
		      googHighpassFilter: 'false',
		    },
	    },
    }).then((s) => {
      stream = s;
      startRecording(onResult);
    })
	    .catch(e => {
	      console.log(e);
	    });
  };


  const stop = () => {
    if (stream) {
      stream.getTracks()[0].stop();
      stream = null;
    }
    
    if (microphone !== null) {
      scriptProcessor.removeEventListener('audioprocess', streamAudioData);
    }
  };

  return {
    start,
    stop,
  }
};

var main = {
  webSpeechApi,
  recorder,
};

module.exports = main;
