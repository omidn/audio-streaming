import withState from 'recompose/withState';
import Recorder from './Recorder';

export default withState('isRecording', 'setIsRecording', false)(Recorder);
