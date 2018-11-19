import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import colors from '../style/themeColor';

function Footer(props) {
  return (
    <div>
      <div style={{ height: 20 }} />
      <Divider light />
      <br />
      <Typography variant='body2' color='inherit' align='center'>
        Contact Us : &nbsp;&nbsp;
        <a href='mailto:student@kawaz.org' style={{ color: '#000000' }}>E-Mail</a>
        &nbsp;&nbsp;
        <a href='https://twitter.com/kawaz_student'
          target="_blank" style={{ color: '#000000' }}>
          Twitter
        </a>
        <br />
        Copyright © 2018 Kawaz Students. All rights reserved.
      </Typography>
    </div>
  );
}

export default Footer;