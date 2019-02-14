import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import range from 'lodash/range';
import noop from 'lodash/noop';
import Recorder from '../../components/Recorder';
import ResultSet from '../../components/ResultSet';
import styles from './styles.css';

const Scroll = ({
  results,
  socket,
  recorder,
  setInput,
}) => {
  const onAudioRecordResult = (arr) => {
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
        <h1>Scroll exampe</h1>
        <div ref={setInput} className={styles.scrollContainer}>
          {
            range(-95, 100).map((x, i) => (
              <p key={i}>{x}</p>
            ))
          }
        </div>
      </div>
      <div>
        <h4>Voice-to-Text results:</h4>
        <ResultSet items={results.slice().reverse()} />
      </div>
      <div>
        <div className={styles.buttonsContainer}>
          <Recorder onClick={onRecorderClickHandler} />
        </div>
        <h4>Lang: en_US</h4>
        <p>
          Web socket
        </p>
      </div>
    </Paper>
  );
};

Scroll.propTypes = {
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
  setInput: PropTypes.func,
};

Scroll.defaultProps = {
  results: [],
  setInput: noop,
};

export default Scroll;
