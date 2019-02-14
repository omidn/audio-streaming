import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import View from '../../components/StreamExample';

const subscriptionKey = '4b4779ecc202432d8bf7ea871dda9e68';
const serviceRegion = 'westeurope';

const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
speechConfig.speechRecognitionLanguage = 'en-US';
const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

export default compose(
  withHandlers({
    onRecorderClickHandler: () => (isRecording) => {
      if (isRecording) {
        recognizer.recognizeOnceAsync(
          (result) => {
            console.log('result', result);
            recognizer.close();
          },
          (err) => {
            console.log('error', err);
            recognizer.close();
          },
        );
      } else {
        recognizer.close();
      }
    },
  }),
)(View);
