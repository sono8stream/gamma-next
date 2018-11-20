import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import colors from '../style/themeColor';

function Header(props) {

  return (
    <div>
      <AppBar position="absolute">
        <div style={{
          backgroundColor: colors.primaryDark,
          height: 5,
        }}>
        </div>
        <div
          style={{
            backgroundColor: colors.primary,
            height: 40,
          }} >
          <Typography variant="h5" color="inherit" align='center' gutterBottom>
            {props.text}
          </Typography>
        </div>
        {(() => {
          if (props.onLoad) {
            return (<LinearProgress color='secondary' />);
          }
        })()}
      </AppBar>
      <div style={{ height: 60 }} />
    </div>
  );
}

export default Header;