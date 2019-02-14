import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import noop from 'lodash/noop';
import FilePicker from '../FilePicker';
import ResultSet from '../ResultSet';
import Recorder from '../Recorder';
import styles from './styles.css';

const GoogleApi = ({
  results = [], onRecorderClickHandler, onFileUpload,
}) => (
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

GoogleApi.propTypes = {
  onRecorderClickHandler: PropTypes.func,
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
  onRecorderClickHandler: noop,
};

export default GoogleApi;
