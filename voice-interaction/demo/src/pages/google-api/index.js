import GoogleApi from './GoogleApi';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';
import lifecycle from 'recompose/lifecycle';
import withState from 'recompose/withState';
import { recorder } from 'sound-api';

console.log('recorder', recorder);

export default compose(
  withProps(props => {
    return {
      ...props,
      recorder,
    }
  }),
  withState('results', 'onSetResults', []),
)(GoogleApi);
