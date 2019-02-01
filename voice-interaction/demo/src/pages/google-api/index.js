import GoogleApi from './GoogleApi';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import io from 'socket.io-client';
import { recorder }  from 'sound-api';

const ENDPOINT = 'http://localhost:5555';

export default compose(
  withProps(props => {
    const { start, stop } = recorder();
    return {
      ...props,
      recorder: {
        start,
        stop,
      },
    }
  }),
  withState('results', 'onSetResults', []),
  withState('socket', 'setSocket', null),
  lifecycle({
    componentDidMount() {
      const { setSocket, onSetResults, results } = this.props;
      
      const socket = io(ENDPOINT, { audoConnect: false });
      setSocket(socket);
      
      socket.on('message', (d) => {
        console.log('d', d);
        results.push({ text: d.transcript, conf: d.confidence });
        onSetResults(results);
      });
    },
  }),
)(GoogleApi);
