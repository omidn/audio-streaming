import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';

const Recorder = ({ isRecording, setIsRecording, onClick }) => (
  <Fab
    color={isRecording ? 'primary' : 'secondary'}
    onClick={() => { setIsRecording(!isRecording); onClick(!isRecording); }}
  >
    {isRecording ? <StopIcon /> : <MicIcon />}
  </Fab>
);

Recorder.propTypes = {
  onClick: PropTypes.func,
  isRecording: PropTypes.bool.isRequired,
  setIsRecording: PropTypes.func.isRequired,
};

Recorder.defaultProps = {
  onClick: noop,
};

export default Recorder;
