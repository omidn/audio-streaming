import lifecycle from 'recompose/lifecycle';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
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
  lifecycle({
    componentDidMount() {
      const { results, onSetResults, setRecorder } = this.props;
      const recorder = api.webSpeechApi({
        ...options,
        onResult: (res) => {
          results.push({ text: res[0].transcript, conf: res[0].confidence });
          onSetResults(results);
        },
      });

      setRecorder(recorder);
    },
  }),
)(Chrome);
