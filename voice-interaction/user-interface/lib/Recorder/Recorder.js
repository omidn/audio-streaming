import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowOutlined from '@material-ui/icons/PlayArrowOutlined';
import StopIcon from '@material-ui/icons/Stop';

const Recorder = ({ isRecording, setIsRecording, onClick }) => (
  <IconButton
    color={isRecording ? 'primary' : 'secondary'}
    onClick={() => { setIsRecording(!isRecording); onClick(!isRecording); }}
  >
    {isRecording ? <StopIcon /> : <PlayArrowOutlined />}
  </IconButton>
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
