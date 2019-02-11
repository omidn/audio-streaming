import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import round from 'lodash/round';
import styles from './styles.css';

const ResultSet = ({ items }) => (
  <div className={styles.wrapper}>
    <List>
      {
        items.map((x, i) => (
          <ListItem key={i}>
            <Chip
              avatar={<Avatar color="secondary">{round(x.conf * 100, 0)}</Avatar>}
              label={x.text}
              clickable
              color={x.isCommand ? "primary" : "secondary"}
            />
          </ListItem>
        ))
      }
    </List>
  </div>
);

ResultSet.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    conf: PropTypes.number,
    text: PropTypes.string,
  })),
};

ResultSet.defaultProps = {
  items: [],
};

export default ResultSet;
