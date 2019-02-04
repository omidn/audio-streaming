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
import Recorder from '../../components/Recorder';
import ChromePage from '../../pages/chrome';
import GoogleApiPage from '../../pages/google-api';
import Wave2letterPage from '../../pages/wave2letter';

import styles from './styles.css';

const Root = ({ recorder, results }) => {
  const onRecorderClickHandler = (isRecording) => isRecording ? recorder.start() : recorder.stop();
  return (
    <div className={styles.App}>
      <AppBar position="static">
        <Toolbar className={styles.toolbar}>
          Built-in chrome example
        </Toolbar>
      </AppBar>
      <Router>
        <div className={styles.wrapper}>
          <div className={styles.navContainer}>
            <List className={styles.navList}>
              <Link to="/"><ListItem button>Chrome built-in</ListItem></Link>
              <Link to="/google-api"><ListItem button>Google Voice API</ListItem></Link>
              <Link to="/wave2letter"><ListItem button>Wave2letter++</ListItem></Link>
            </List>
          </div>
          <div className={styles.results}>
            <Route component={ChromePage} path="/" exact />
            <Route component={GoogleApiPage} path="/google-api" exact />
            <Route component={Wave2letterPage} path="/wave2letter" />
          </div>
        </div>
      </Router>
    </div>
  );
}

export default Root;
