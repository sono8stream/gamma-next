import React, { Component } from 'react';
import {firebaseAuth, firebaseDB} from '../firebase';
import remark from 'remark';
import htmlConverter from 'remark-html';
import Head from 'next/head';
import { withRouter } from 'next/router';
import { Link,Router } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

import Header from '../components/Header';
import Footer from '../components/Footer';

const blogRef = firebaseDB.ref('blogs');
const processor = remark().use(htmlConverter, { sanitize: false });

class BlogShow extends Component {
  constructor(props) {
    super(props);

    if (!props.val) {
      this.returnIndex();
      return;
    }

    this.state = {
      authorName: '',
      categories: ['未分類'],
      viewerUid: undefined,
    };

    let authorNameRef = firebaseDB.ref(`accounts/${props.val.author}`);
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
          if (!data.title) {
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
                          <Link route='blogEdit'
                            params={{ id: this.props.router.query.id }}>
                            <Button variant='outlined' color='primary'>
                              編集する
            </Button>
                          </Link>
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
                        {this.state.categories.map((category) => (
                          <Chip
                            label={category}
                            clickable
                            variant='outlined'
                          />
                        ))}
                        <br />
                        <br />
                        <Divider light />
                        <Typography variant='body2' >
                          <div
                            dangerouslySetInnerHTML={
                              { __html: processor.processSync(data.text).contents }
                            } /> 
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Link route='/blogs'>
                      <Button variant='outlined'>
                        一覧に戻る
            </Button>
                    </Link>
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
  return { val: snapshot.val() }
}

export default withRouter(BlogShow);