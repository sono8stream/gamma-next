import React from 'react';
import { firebaseAuth, firebaseDB } from '../firebase';
import { Router } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = { onLogin: false };
  }

  login() {

    this.setState({ onLogin: true });

    let provider = new firebaseAuth.GithubAuthProvider();
    firebaseAuth().signInWithPopup(provider).then(result => {
      if (result.credential) {
        let ref = firebaseDB.ref('accounts').child(result.user.uid);

        let request = new XMLHttpRequest();
        ref.once('value', snapshot => {
          let token = result.credential.accessToken;
          request.open("GET",
            `https://api.github.com/user?access_token=${token}`);
          request.responseType = 'json';
          request.addEventListener("load", (event) => {
            if (event.target.status === 200) {
              let name = event.target.response.name;
              if (!name) {
                name = event.target.response.login;
              }

              ref.update({
                email: result.user.email,
                token: token,
                name: name,
              }, error => {
                if (!error) {
                  Router.pushRoute('/blogs');
                }
              });
            }
          });
          request.send();
        });
      }
    });
  }

  render() {
    return (
      <div>
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
                    onClick={() => this.login()}>
                    ログインする
                </Button>
                );
              }
            })()}
          </Grid>
        </Grid>
        <Footer />
      </div>
    );
  }
}