import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ChromePage from '../../pages/chrome';
import GoogleApiPage from '../../pages/google-api';
import ScrollPage from '../../pages/scroll';
import ResourcesPage from '../../pages/resources';
import styles from './styles.css';

const Root = () => (
  <div className={styles.App}>
    <AppBar position="static">
      <Toolbar className={styles.toolbar}>
        Audio-to-Text Lab
      </Toolbar>
    </AppBar>
    <Router>
      <div className={styles.wrapper}>
        <div className={styles.navContainer}>
          <List className={styles.navList}>
            <Link to="/"><ListItem button>Chrome built-in</ListItem></Link>
            <Link to="/google-api"><ListItem button>Google Voice API</ListItem></Link>
            <Link to="/scroll-exapmle"><ListItem button>Scroll example</ListItem></Link>
            <Link to="/resources"><ListItem button>Other resources</ListItem></Link>
          </List>
        </div>
        <div className={styles.results}>
          <Route component={ChromePage} path="/" exact />
          <Route component={GoogleApiPage} path="/google-api" exact />
          <Route component={ScrollPage} path="/scroll-example" exact />
          <Route component={ResourcesPage} path="/resources" />
        </div>
      </div>
    </Router>
  </div>
);

export default Root;
