export default () => {
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
  }


  const streamAudioData = (e) => {
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
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }

      // normalize the median buffer
      result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    
    return result.buffer;
  }
  
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
  }


  const stop = () => {
    if (stream) {
      stream.getTracks()[0].stop();
      stream = null;
    }
    
    if (microphone !== null) {
      scriptProcessor.removeEventListener('audioprocess', streamAudioData);
    }
  }

  return {
    start,
    stop,
  }
}
