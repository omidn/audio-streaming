const SDK = require('microsoft-cognitiveservices-speech-sdk');
const subscriptionKey = '55e21d2e-0eca-4f64-b9e6-933f37ff54b2';
const serviceRegion = "westeurope";

module.exports = socket => {
  // create the push stream we need for the speech sdk.
  const pushStream = SDK.AudioInputStream.createPushStream();
  
  // now create the audio-config pointing to our stream and
  // the speech config specifying the language.
  const audioConfig = SDK.AudioConfig.fromStreamInput(pushStream);
  const speechConfig = SDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechRecognitionLanguage = "en-US";

  // create the speech recognizer.
  const recognizer = new SDK.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizing = function (s, e) {
    var str = "(recognizing) Reason: " + SDK.ResultReason[e.result.reason] + " Text: " + e.result.text;
    console.log(str);
  };

  // The event recognized signals that a final recognition result is received.
  // This is the final event that a phrase has been recognized.
  // For continuous recognition, you will get one recognized event for each phrase recognized.
  recognizer.recognized = function (s, e) {
    // Indicates that recognizable speech was not detected, and that recognition is done.
    if (e.result.reason === SDK.ResultReason.NoMatch) {
      const  noMatchDetail = SDK.NoMatchDetails.fromResult(e.result);
      console.log("\r\n(recognized)  Reason: " + SDK.ResultReason[e.result.reason] + " NoMatchReason: " + SDK.NoMatchReason[noMatchDetail.reason]);
    } else {
      console.log("\r\n(recognized)  Reason: " + SDK.ResultReason[e.result.reason] + " Text: " + e.result.text);
    }
  };

  recognizer.canceled = function (s, e) {
    var str = "(cancel) Reason: " + sdk.CancellationReason[e.reason];
    if (e.reason === sdk.CancellationReason.Error) {
      str += ": " + e.errorDetails;
    }
    console.log(str);
  };

  // Signals that a new session has started with the speech service
  recognizer.sessionStarted = function (s, e) {
    var str = "(sessionStarted) SessionId: " + e.sessionId;
    console.log(str);
  };

  // Signals the end of a session with the speech service.
  recognizer.sessionStopped = function (s, e) {
    var str = "(sessionStopped) SessionId: " + e.sessionId;
    console.log(str);
  };

  // Signals that the speech service has started to detect speech.
  recognizer.speechStartDetected = function (s, e) {
    var str = "(speechStartDetected) SessionId: " + e.sessionId;
    console.log(str);
  };

  // Signals that the speech service has detected that speech has stopped.
  recognizer.speechEndDetected = function (s, e) {
    var str = "(speechEndDetected) SessionId: " + e.sessionId;
    console.log(str);
  };

  recognizer.startContinuousRecognitionAsync(res => {
    console.log('recognition started')
  }, err => {
    console.log('error', err)
  });
  
  return pushStream;
};
