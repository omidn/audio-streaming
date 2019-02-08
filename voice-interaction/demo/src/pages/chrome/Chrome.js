import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import ResultSet from '../../components/ResultSet';
import Recorder from '../../components/Recorder';
import styles from './styles.css';

const Chrome = ({ recorder, results }) => {
  const onRecorderClickHandler = isRecording => isRecording ? recorder.start() : recorder.stop();

  return (
    <Paper className={styles.wrapper}>
      <div>
        <h4>Voice-to-Text results:</h4>
        <ResultSet items={results.reverse()} />
      </div>
      <div className={styles.settings}>
        <Recorder onClick={onRecorderClickHandler} />
        <h4>Lang: en_US</h4>
        <h4>Continuous: true</h4>
        <p>
          connect a microphone to your computer and hit record button,
          the Voice-to-Text results will appear in the left panel
        </p>
      </div>
    </Paper>
  );
};

Chrome.propTypes = {
  recorder: PropTypes.shape({
    start: PropTypes.func,
    stop: PropTypes.func,
  }).isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    conf: PropTypes.number,
    text: PropTypes.string,
  })).isRequired,
};

export default Chrome;
