import React, { Component } from 'react';
import api from 'sound-api';
import styles from './App.css';

const options = {
  'go-up': () => {
    console.log('scroll up');
    window.scrollBy(0, -500);
  },
  'go-down': () => {
    console.log('scroll down');
    window.scrollBy(0, 500);
  },
};

const sound = api(options);

class App extends Component {
  componentDidMount() {
    sound.start();
  }

  componentWillUnmount() {
    sound.stop();
  }

  render() {
    return (
      <div className={styles.App}>
        <p>Aliquam posuere.</p>
        <p>Nullam libero mauris, consequat quis, varius et, dictum id, arcu.</p>
        <p>Vivamus id enim.</p>
        <p>Curabitur lacinia pulvinar nibh.</p>
        <p>Donec pretium posuere tellus.</p>
        <p>Aliquam feugiat tellus ut neque.</p>
        <p>Donec posuere augue in quam.</p>
      </div>
    );
  }
}

export default App;
