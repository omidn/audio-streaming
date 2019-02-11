import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import io from 'socket.io-client';
import kebabCase from 'lodash/kebabCase';
import { recorder } from 'sound-api';
import Scroll from './Scroll';

const ENDPOINT = 'http://localhost:5555';

const commands = {
  'scroll-up': (input) => {
    input.scrollBy({ top: -200, left: 0, behavior: 'smooth' });
  },
  'scroll-down': (input) => {
    input.scrollBy({ top: 200, left: 0, behavior: 'smooth' });
  }
}

export default compose(
  withProps((props) => {
    const { start, stop } = recorder();
    return {
      ...props,
      recorder: {
        start,
        stop,
      },
    };
  }),
  withState('input', 'setInput', null),
  withState('results', 'onSetResults', []),
  withState('socket', 'setSocket', null),
  withHandlers({
    addResult: ({ results, onSetResults, input }) => (result) => {
      let { text } = result, isCommand = false;
      text = kebabCase(text);

      for (let command in commands) {
        const re = new RegExp(command, 'ig');
        if (re.test(text)) {
          isCommand = true;
          commands[command](input);
          break;
        }
      }
      
      onSetResults(results.concat({
        ...result,
        isCommand,
      }));
    },
  }),
  lifecycle({
    componentDidMount() {
      const { setSocket, addResult, input, setInput } = this.props;
      console.log('input', input, setInput);
      const socket = io(ENDPOINT);
      setSocket(socket);
      socket.on('message', (data) => {
        const result = JSON.parse(data);
        addResult({ text: result.transcript, conf: result.confidence });
      });
    },
  }),
)(Scroll);
