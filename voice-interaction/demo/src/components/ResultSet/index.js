import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import round from 'lodash/round';

const ResultSet = ({ items }) => (
  <List>    
    {
      items.map(x =>(
        <ListItem key={x.text}>
          <Chip
            avatar={<Avatar color="secondary">{round(x.conf * 100, 0)}</Avatar>}
            label={x.text}
            clickable
            color="secondary"
          />
        </ListItem>              
      ))
    }
  </List>
);

export default ResultSet;
