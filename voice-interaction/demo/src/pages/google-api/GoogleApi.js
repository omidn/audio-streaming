import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ResultSet from '../../components/ResultSet';
import Recorder from '../../components/Recorder'
import styles from './styles.css';

const GoogleApi = ({ socket, recorder, results }) => {
  const onAudioRecordResult = (arr) => {
    if (socket && socket.readyState === socket.OPEN) {
      socket.send(arr);
    }
  }
  
  const onRecorderClickHandler = (isRecording) => {
    if (isRecording) {
      recorder.start(onAudioRecordResult)
      socket.open();
    } else {
      socket.disconnect();
      recorder.stop(); 
   }
  }
  return (
    <Paper className={styles.wrapper}>
      <div>
        <h4>Voice-to-Text results:</h4>
        <ResultSet items={results.reverse()} />
      </div>
      <div className={styles.settings}>
        <Recorder onClick={onRecorderClickHandler} />
        <h4>Lang: en_US</h4>
        <p>
          Web socket
        </p>
      </div>
    </Paper>
  );
};

export default GoogleApi;
