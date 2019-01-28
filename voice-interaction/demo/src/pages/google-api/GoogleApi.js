import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/PlayArrowOutlined';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import round from 'lodash/round';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ResultSet from '../../components/ResultSet';
import Recorder from '../../components/Recorder'
import styles from './styles.css';

const GoogleApi = ({ recorder, results }) => {
  const onRecorderClickHandler = (isRecording) => isRecording ? recorder.start() : recorder.stop();
  
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
