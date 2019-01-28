import lifecycle from 'recompose/lifecycle';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import withState from 'recompose/withState';
import api from 'sound-api';
import Chrome from './Chrome';
import styles from './styles.css';

const options = {
  commands: {
    'go-up': () => {
      console.log('scroll up');
      window.scrollBy(0, -500);
    },
    'go-down': () => {
      console.log('scroll down');
      window.scrollBy(0, 500);
    },
  }
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
    }
  }),
)(Chrome);
