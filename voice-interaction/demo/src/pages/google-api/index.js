import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import io from 'socket.io-client';
import { recorder as AudioRecorder } from 'sound-api';
import View from '../../components/StreamExample';

const ENDPOINT = 'http://localhost:5555';

export default compose(
  withProps((props) => {
    const { start, stop } = AudioRecorder();
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
    onAudioRecordResult: ({ socket }) => (arr) => {
      if (socket && socket.readyState === socket.OPEN) {
        socket.send(arr);
      }
    },
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
    onRecorderClickHandler: ({ onAudioRecordResult, socket, recorder }) => (isRecording) => {
      if (isRecording) {
        recorder.start(onAudioRecordResult);
        socket.open();
      } else {
        socket.disconnect();
        recorder.stop();
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { setSocket, addResult } = this.props;
      const socket = io(ENDPOINT, { autoConnect: false });
      setSocket(socket);
      socket.on('message', (data) => {
        const result = JSON.parse(data);
        addResult({ text: result.transcript, conf: result.confidence });
      });
    },
  }),
)(View);
