import GoogleApi from './GoogleApi';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import io from 'socket.io-client';
import { recorder }  from 'sound-api';

const ENDPOINT = 'http://localhost:5555';

export default compose(
  withProps(props => {
    const { start, stop } = recorder();
    return{
      ...props,
      recorder: {
        start,
        stop,
      },
    }
  }),
  withState('results', 'onSetResults', []),
  withState('socket', 'setSocket', null),
  withHandlers({
    onFileUpload: ({ results, onSetResults }) => async file => {
      console.log('file', file);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const r = await fetch('http://localhost:5555/upload', {
          method: 'POST',
          body: formData,
        });
        const json = await r.json();
        results.push({ text: json.transcript, conf: json.confidence });
        onSetResults(results);
      } catch(err) {
        console.log('error', err);
      }      
    }
  }),
  lifecycle({
    componentDidMount() {
      const { setSocket, onSetResults, results } = this.props;
      const socket = io(ENDPOINT, { audoConnect: false });
      setSocket(socket);
      
      socket.on('message', (d) => {
        results.push({ text: d.transcript, conf: d.confidence });
        onSetResults(results);
      });
    },
  }),
)(GoogleApi);
 
