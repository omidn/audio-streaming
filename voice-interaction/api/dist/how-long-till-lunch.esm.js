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

var main = {
  webSpeechApi,
};

export default main;
