import React from 'react';
import Paper from '@material-ui/core/Paper';
import range from 'lodash/range';
import styles from './styles.css';

const LongList = () => (
  <div className={styles.scrollContainer}>
    {
      range(100).map(x => (
        <p>{x}</p>
      ))
    }
  </div>
);

const Scroll = () => (
  <Paper className={styles.wrapper}>
    <h1>Scroll exampe</h1>
    <LongList />
  </Paper>
);

export default Scroll;
