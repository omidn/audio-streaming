import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';


const Recorder = ({ isRecording, toggle }) => (
  <Fab
    color={isRecording ? 'primary' : 'secondary'}
    onClick={toggle}
  >
    {isRecording ? <StopIcon /> : <MicIcon />}
  </Fab>
);

Recorder.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Recorder;
