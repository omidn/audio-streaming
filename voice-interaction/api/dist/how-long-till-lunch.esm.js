import 'lodash/kebabCase';
import lowerCase from 'lodash/lowerCase';
import noop from 'lodash/noop';
import extend from 'lodash/extend';

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

const CONVERSION_RATE = 2 ** (16 - 1) - 1; // 32767

var recorder = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContex;
  const audioContext = audioContext || new AudioContext();
  let inputPoint = null, microphone = null, analyser = null,  scriptProcessor = null;
  
  const startRecording = (stream, callback) => {
    if (!audioContext) {
      return;
    }

    inputPoint = audioContext.createGain();
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    scriptProcessor = inputPoint.context.createScriptProcessor(2048, 2, 2);

    // actually start recording, the converse is to disconnect() microphone and recording should stop
    microphone.connect(inputPoint);
    inputPoint.connect(analyser);
    inputPoint.connect(scriptProcessor);
    scriptProcessor.connect(inputPoint.context.destination);
    
	  // This is for registering to the “data” event of audio stream, without overwriting the default scriptProcessor.onAudioProcess function if there is one.
	  scriptProcessor.addEventListener('audioprocess', e => {
      const floatSamples = e.inputBuffer.getChannelData(0);
      const r = Int16Array.from(floatSamples.map(n => n * CONVERSION_RATE));
      onResult(r);
    });
  };

  const start = () => {
    navigator.mediaDevices.getUserMedia({
	    audio: {
	      mandatory: {
		      googEchoCancellation: 'false',
		      googAutoGainControl: 'false',
		      googNoiseSuppression: 'false',
		      googHighpassFilter: 'false',
		    },
	    },
    }).then(startRecording)
	    .catch(e => {
	      console.log(e);
	    });
  };


  const stop = () => {
    if (microphone !== null) {
      microphone.disconnect();
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

export default main;
