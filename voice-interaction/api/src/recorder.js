const CONVERSION_RATE = 2 ** (16 - 1) - 1; // 32767
const MAX_INT = Math.pow(2, 53);

export default () => {
  const AudioContext = window.AudioContext || window.webkitAudioContex;
  const audioContext = audioContext || new AudioContext();
  let inputPoint = null, microphone = null, analyser = null,  scriptProcessor = null;
  
  const startRecording = (stream, onResult, callback) => {
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
  }

  const start = (onResult) => {
    navigator.mediaDevices.getUserMedia({
	    audio: {
	      mandatory: {
		      googEchoCancellation: 'false',
		      googAutoGainControl: 'false',
		      googNoiseSuppression: 'false',
		      googHighpassFilter: 'false',
		    },
	    },
    }).then((stream) => {
      startRecording(stream, onResult);
    })
	    .catch(e => {
	      console.log(e);
	    });
  }


  const stop = () => {
    if (microphone !== null) {
      scriptProcessor.disconnect(inputPoint.context.destination);
      inputPoint.disconnect(scriptProcessor);
      inputPoint.disconnect(analyser);
      microphone.disconnect(inputPoint); 
    }
  }

  return {
    start,
    stop,
  }
}

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
