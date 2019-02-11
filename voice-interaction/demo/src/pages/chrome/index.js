import lifecycle from 'recompose/lifecycle';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import api from 'sound-api';
import Chrome from './Chrome';

const options = {
  commands: {
    'go-up': () => {
      window.scrollBy(0, -500);
    },
    'go-down': () => {
      window.scrollBy(0, 500);
    },
  },
};

export default compose(
  withState('recorder', 'setRecorder', null),
  withState('results', 'onSetResults', []),
  withHandlers({
    addResult: ({ results, onSetResults }) => (result) => {
      onSetResults(results.concat(result));
    },
  }),
  lifecycle({
    componentDidMount() {
      const { addResult, setRecorder } = this.props;
      const recorder = api.webSpeech({
        ...options,
        onResult: (res) => {
          addResult({
            text: res[0].transcript,
            conf: res[0].confidence,
          });
        },
      });

      setRecorder(recorder);
    },
  }),
)(Chrome);
