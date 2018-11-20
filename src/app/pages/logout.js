import React from 'react';
import { firebaseAuth } from '../firebase';
import { Router } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeProvider from '../style/theme';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { onLogout: false };
  }

  logout() {
    this.setState({ onLogout: true });

    firebaseAuth().signOut().then(() => {
      Router.pushRoute('/blogs');
    });
  }

  render() {
    return (
      <ThemeProvider>
        <Header text='GAMMA Login' />
        <Grid container justify='center'>
          <Grid item>
            {(() => {
              if (this.state.onLogin) {
                return <CircularProgress color='secondary' />;
              }
              else {
                return (
                  <Button color='secondary' variant='contained'
                    onClick={() => this.logout()}>
                    ログアウトする
                </Button>
                );
              }
            })()}
          </Grid>
        </Grid>
        <Footer />
      </ThemeProvider>
    )
  }
}