import GoogleApi from './GoogleApi';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import io from 'socket.io-client';
import { recorder }  from 'sound-api';

export default compose(
  withProps(props => {
    console.log('recorder', recorder());
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
      const { setSocket } = this.props;
      const socket = io('http://localhost:5555');
      setSocket(socket);
      socket.on('chat', (d) => {
        console.log('d', d);
      });
    },
  }),
)(GoogleApi);
