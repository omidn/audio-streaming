import webSpeechApi from './web-speech-api';
import { start, stop } from './recorder';

export default {
  webSpeechApi,
  recorder: {
    start, stop,
  }
};
