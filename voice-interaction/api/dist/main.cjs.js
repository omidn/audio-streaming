'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lowerCase = _interopDefault(require('lodash/lowerCase'));
var noop = _interopDefault(require('lodash/noop'));
var extend = _interopDefault(require('lodash/extend'));

/** 
* @desc defaults
*/
const defaults = {
  interimResults: false,
  continuous: true,
  lang: 'en-US',
  maxAlternatives: 3,
  onResult: noop,
};

/** 
* @desc returns the recorder instance from webKitAudioContext
* @example 
* import api from 'sound-api';
* const recorder = api.webSpeechApi({
*   commands: {
*    'go-up': () => {
*      window.scrollBy(0, -500);
*    },
*    'go-down': () => {
*      window.scrollBy(0, 500);
*    },
*  },
* });
* @param {WebKitType} [options] options options
* @return {object} 
* @property {function} start - starts recording audio from microphone
* @property {function} stop  - stops recording audio from microphone
*/
function webSpeech (options) {
  const opt = extend(defaults, opt);
  const recognition = new webkitSpeechRecognition();
  
  if (opt.commands) {
    const commands = options.commands;
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${Object.keys(commands).map(x => lowerCase(x)).join(' | ')} ;`;
    const list = new webkitSpeechGrammarList();
    list.addFromString(grammar, 1);
    recognition.grammars = list;
  }

  recognition.continuous = opt.continuous;
  recognition.interimResults = opt.interimResults;
  recognition.lang = opt.lang;
  recognition.maxAlternatives = opt.maxAlternatives;

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
      opt.onResult(msg);
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

/** 
* @typedef {Object} WebKitType
* @property {function} onResult - callback to receive Audio-to-Text results
* @property {string} [lang] - set preferred language language 
* @property {string} [interimResults] - receive intermediate results
* @property {boolean} [continuous] - record audio continuous
* @property {number} [maxAlternatives] - maximum number of alternatives
*/

/** 
* @desc Use  Google's Speech to text API 
* @see https://cloud.google.com/speech-to-text/docs/
* @return {RecordType} 
* @example
* import { recorder } from 'sound-api';
* const { start, stop } = recorder(); 
*/
var recorder = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContex;
  const audioContext = audioContext || new AudioContext();
  let onResult = null, inputPoint = null, stream = null, microphone = null, analyser = null,  scriptProcessor = null;
  
  // docs
  const startRecording = (onResult, callback) => {
    if (!audioContext) {
      return;
    }
    
    // define the audio graph
    inputPoint = audioContext.createGain();
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    // 2045 buffer size, one input, one output (mono input and output)
    scriptProcessor = inputPoint.context.createScriptProcessor(2048, 1, 1);
    

    // actually start recording, the converse is to disconnect() microphone and recording should stop
    microphone.connect(inputPoint);
    inputPoint.connect(analyser);
    inputPoint.connect(scriptProcessor);
    scriptProcessor.connect(inputPoint.context.destination);
    
	  // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
	  scriptProcessor.addEventListener('audioprocess', streamAudioCallback);
    console.log('started recording');
  };


  const streamAudioCallback = (e) => {
    onResult(downSampleBuffer(e.inputBuffer.getChannelData(0), audioContext.sampleRate, 16000)); // Usually, 44100 -> 16000
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
    let offsetResult = 0, offsetBuffer = 0;
    
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
      
      // calculate median buffer value over nextOffsetBuffer
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }

      // normalize the median buffer and multiply it to INT_MAX 2^15 - 1 (32767)
      result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    
    return result.buffer;
  };
  
  /**
   * @desc starts recording audio from microphones
   * @param {number} the callback which receives the recorded audio buffer
   */
  const start = (callback) => {
    onResult = callback;
    // try to start recording audio
    navigator.mediaDevices.getUserMedia({
	    audio: true,
      // mandatory: {
		  //   googEchoCancellation: false,
		  //   googAutoGainControl: false,
		  //   googNoiseSuppression: false,
		  //   googHighpassFilter: false,
		  // },
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
    
    if (scriptProcessor !== null) {
      scriptProcessor.removeEventListener('audioprocess', streamAudioCallback);
    }
  };

  return {
    start,
    stop,
  }
};
/**
* @typedef {Object} RecordType
* @property {function} start start recording audio
* @property {function} stop stop recording audio
*/

var main = {
  webSpeech,
  recorder,
};

module.exports = main;
