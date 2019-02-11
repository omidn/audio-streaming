import lowerCase from 'lodash/lowerCase';
import noop from 'lodash/noop';
import extend from 'lodash/extend';
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
export default function (options) {
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
  recognition.lang = opt.lang
  recognition.maxAlternatives = opt.maxAlternatives;

  const start = () => {
    recognition.start();
    console.log('started recording');
  }
  
  const stop = () => {
    recognition.stop();
    console.log('stopped recording');
  }

  recognition.onresult = function(e) {
    const msg = e.results[e.results.length - 1];
    
    if (options.onResult) {
      opt.onResult(msg);
    }
  }
  
  recognition.onerror = function(event) {
    console.log(event.error);
  }
  
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
