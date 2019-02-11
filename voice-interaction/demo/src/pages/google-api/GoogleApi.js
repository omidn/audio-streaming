import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import noop from 'lodash/noop';
import FilePicker from '../../components/FilePicker';
import ResultSet from '../../components/ResultSet';
import Recorder from '../../components/Recorder';
import styles from './styles.css';

const GoogleApi = ({
  socket, recorder, results, onFileUpload,
}) => {
  const onAudioRecordResult = (arr) => {
    console.log('arr', arr);
    if (socket && socket.readyState === socket.OPEN) {
      socket.send(arr);
    }
  };

  const onRecorderClickHandler = (isRecording) => {
    if (isRecording) {
      recorder.start(onAudioRecordResult);
      socket.open();
    } else {
      socket.disconnect();
      recorder.stop();
    }
  };

  return (
    <Paper className={styles.wrapper}>
      <div>
        <h4>Voice-to-Text results:</h4>
        <ResultSet items={results.slice().reverse()} />
      </div>
      <div className={styles.settings}>
        <div className={styles.buttonsContainer}>
          <Recorder onClick={onRecorderClickHandler} />
          <FilePicker onFileSelected={onFileUpload} />
        </div>
        <h4>Lang: en_US</h4>
        <p>
          Web socket
        </p>
      </div>
    </Paper>
  );
};

GoogleApi.propTypes = {
  socket: PropTypes.shape({
    open: PropTypes.func,
    disconnect: PropTypes.func,
  }).isRequired,
  recorder: PropTypes.shape({
    start: PropTypes.func,
    stop: PropTypes.func,
  }).isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    conf: PropTypes.number,
    text: PropTypes.string,
  })),
  onFileUpload: PropTypes.func,
};

GoogleApi.defaultProps = {
  results: [],
  onFileUpload: noop,
};

export default GoogleApi;
