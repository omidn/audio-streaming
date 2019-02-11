import withState from 'recompose/withState';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import Recorder from './Recorder';

const MAX_RECORD_DURATION_MS = 60000;

export default compose(
  withState('isRecording', 'setIsRecording', false),
  withState('timer', 'setTimer', null),
  withHandlers({
    toggle: ({
      isRecording, setIsRecording, onClick, timer, setTimer,
    }) => () => {
      const newState = !isRecording;
      setIsRecording(newState);
      onClick(newState);

      if (newState) {
        if (timer) {
          clearTimeout(timer);
        }

        const t = setTimeout(() => {
          setIsRecording(false);
          onClick(false);
        }, MAX_RECORD_DURATION_MS);

        setTimer(t);
      }
    },
  }),
)(Recorder);
