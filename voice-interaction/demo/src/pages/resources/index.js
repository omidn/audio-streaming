import React from 'react';
import Paper from '@material-ui/core/Paper';
import styles from './styles.css';

const Resources = () => (
  <Paper className={styles.wrapper}>
    <h1>Other resources</h1>
    <ul>
      <li>
        <a href="https://github.com/facebookresearch/wav2letter">Wave2letter++</a>
        <span>: an open-source facebook speech processing written in C++. </span>
        <a href="https://arxiv.org/abs/1812.07625">Extremely fast training time</a>
        <span> but no pretrained models available.</span>
      </li>
      <li>
        <a href="https://azure.microsoft.com/en-us/services/cognitive-services/speech-to-text/">
          Microsoft Azure
        </a>
        <span>: provides both speech-to-text services over HTTP API and Web Socket.</span>
      </li>
      <li>
        <a href="https://dialogflow.com/">DialogFlow</a>
        <span>: platform agnostic voice assistant, easy to configure and setup.</span>
      </li>
    </ul>
  </Paper>
);

export default Resources;
