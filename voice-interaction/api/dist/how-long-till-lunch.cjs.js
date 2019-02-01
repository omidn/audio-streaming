'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('lodash/kebabCase');
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
  console.log(options);
  recognition.onresult = function(e) {
    if (options.onResult) {
      options.onResult(e.results[e.results.length - 1]);
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
    onResult(downSampleBuffer(e.inputBuffer.getChannelData(0), 44100, 16000));
  };

  const downSampleBuffer = function (buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
        return buffer;
    }
    if (outSampleRate > sampleRate) {
        throw "downsampling rate show be smaller than original sample rate";
    }
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);
    let  offsetResult = 0, offsetBuffer = 0;
    
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = Math.min(1, accum / count)*0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    
    return result.buffer;
  };
  
  const start = (func) => {
    onResult = func;
    
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
      // inputPoint.disconnect(scriptProcessor);
      // inputPoint.disconnect(analyser);
      // microphone.disconnect(inputPoint); 
    }
  };

  return {
    start,
    stop,
  }
};

// export const start = (onResult) => {
//   const startRecording = (stream, callback) => {
//     const AudioContext = window.AudioContext || window.webkitAudioContex;
//     const audioContext = audioContext || new AudioContext();
    
//     if (!audioContext) {
//       return;
//     }
    
//     const inputPoint = audioContext.createGain();
//     const microphone = audioContext.createMediaStreamSource(stream);
//     const analyser = audioContext.createAnalyser();
//     const scriptProcessor = inputPoint.context.createScriptProcessor(2048, 2, 2);

//     // actually start recording, the converse is to disconnect() microphone and recording should stop
//     microphone.connect(inputPoint);
//     inputPoint.connect(analyser);
//     inputPoint.connect(scriptProcessor);
//     scriptProcessor.connect(inputPoint.context.destination);
    
// 	  // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
// 	  scriptProcessor.addEventListener('audioprocess', e => {
//       const floatSamples = e.inputBuffer.getChannelData(0);
//       const r = Int16Array.from(floatSamples.map(n => n * CONVERSION_RATE));
//       onResult(r);
//     });
//   }

//   navigator.mediaDevices.getUserMedia({
// 	  audio: {
// 	    mandatory: {
// 		    googEchoCancellation: 'false',
// 		    googAutoGainControl: 'false',
// 		    googNoiseSuppression: 'false',
// 		    googHighpassFilter: 'false',
// 		  },
// 	  },
//   }).then(startRecording)
// 	  .catch(e => {
// 	    console.log(e);
// 	  });
// }

// export const stop = () => {
//   console.log('stopped recording');
// }

var main = {
  webSpeechApi,
  recorder,
};

module.exports = main;
