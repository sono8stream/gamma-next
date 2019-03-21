import React, { Component } from 'react';
import {firebaseAuth, firebaseDB} from '../firebase';
import Head from 'next/head';
import { withRouter } from 'next/router';
import { Router } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LinkButton from '../components/LinkButton';
import Markdown from '../components/Markdown';

const blogRef = firebaseDB.ref('blogs');

class BlogShow extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      authorName: '',
      categories: ['未分類'],
      viewerUid: undefined,
    };
  }

  componentDidMount() {
    console.log(this.props.val);

    if (!this.props.val) {
      this.returnIndex();
      return;
    }

    let authorNameRef = firebaseDB.ref(`accounts/${this.props.val.author}`);
    authorNameRef.once('value', account => {
      let accountVal = account.val();
      if (accountVal) {
        this.setState({ authorName: accountVal.name });
      }
    });

    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ viewerUid: user.uid });
      }
    });
  }

  returnIndex() {
    Router.pushRoute('/blogs');
  }

  render() {
    let data = this.props.val;

    return (
      <div>
        {(() => {
          if (data) {
            return (
              <Head>
                <meta property="og:title" content={data.title} />
                <meta property="og:description" content={data.preview} />
                <meta property="og:type" content='article' />
                <meta property="og:site_name" content='KawazST Blog' />
              </Head>
            );
          }
        })()}
        {(() => {
          if (!(data&& this.state)) {
            return <Header text="KawazST Blog" onLoad />;
          }
          else {
            return (
              <div>
                <Header text='KawazST Blog' />
                <Grid container spacing={16}>
                  {(() => {
                    if (this.state.viewerUid === data.author) {
                      return (
                        <Grid item>
                          <LinkButton route='blogEdit' params={{ id: this.props.router.query.id }}
                            variant='outlined' color='primary'>
                            {'編集する'}
                          </LinkButton>
                        </Grid>
                      );
                    }
                  })()}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          {data.title}
                        </Typography>
                        <Typography variant='subtitle2' gutterBottom>
                          {`${data.date}   by ${this.state.authorName}`}
                        </Typography>
                        {this.state.categories.map((category, i) => (
                          <Chip
                            key={i}
                            label={category}
                            clickable
                            variant='outlined'
                          />
                        ))}
                        <br />
                        <br />
                        <Divider light />
                        <Markdown>{data.text}</Markdown>
                        <Divider/>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item>
                    <LinkButton route='blogs'
                      variant='outlined' color='primary'>
                      {'一覧に戻る'}
                    </LinkButton>
                  </Grid>
                </Grid>
                <Footer />
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

BlogShow.getInitialProps = async ({ query }) => {
  let snapshot = await blogRef.child(query.id).once('value');
  return { val: snapshot.val() };
}

export default withRouter(BlogShow);