import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import io from 'socket.io-client';
import { recorder } from 'sound-api';
import GoogleApi from './GoogleApi';

const ENDPOINT = 'http://localhost:5555';

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
  withState('results', 'onSetResults', []),
  withState('socket', 'setSocket', null),
  withHandlers({
    addResult: ({ results, onSetResults }) => (result) => {
      onSetResults(results.concat(result));
    },
  }),
  withHandlers({
    onFileUpload: ({ addResult }) => async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const r = await fetch(`${ENDPOINT}/upload`, {
          method: 'POST',
          body: formData,
        });
        const json = await r.json();
        addResult({ text: json.transcript, conf: json.confidence });
      } catch (err) {
        // jsut don't crash and do nothing.
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { setSocket, addResult } = this.props;
      const socket = io(ENDPOINT, { audoConnect: false });
      setSocket(socket);
      socket.on('message', (data) => {
        const result = JSON.parse(data);
        addResult({ text: result.transcript, conf: result.confidence });
      });
    },
  }),
)(GoogleApi);
