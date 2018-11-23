import React, { Component } from 'react';
import {firebaseAuth, firebaseDB} from '../firebase';
import remark from 'remark';
import reactRenderer from 'remark-react';
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
const processor=remark().use(reactRenderer);

class BlogShow extends Component {
  constructor(props) {
    super(props);

    console.log("constructor");
    this.state = {
      author: '',
      authorName: '',
      date: '',
      title: '',
      categories: ['未分類'],
      text: '',
      error: '',
      viewerUid: undefined,
    };
  }

  componentDidMount() {
    let ref = blogRef.child(this.props.router.query.id);
    ref.on('value', snapshot => {
      let val = snapshot.val();
      if (!val) {
        this.returnIndex();
        return;
      }

      let categories = this.state.categories;
      if (val.categories) {
        Object.keys(val.categories).forEach(key => {
          categories.push(key);
        });
      }
      this.setState({
        author: val.author,
        date: val.date,
        title: val.title,
        categories: categories,
        text: val.text,
      });

      let authorNameRef = firebaseDB.ref(`accounts/${val.author}`);
      authorNameRef.once('value', account => {
        let accountVal = account.val();
        if (accountVal) {
          this.setState({ authorName: accountVal.name });
        }
      })

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

    return (
      <div>
        {(() => {
          if (this.props.val) {
            return (
              <Head>
                <meta property="og:title" content={this.props.val.title} />
                <meta property="og:description" content={this.props.val.preview} />
                <meta property="og:type" content='article' />
                <meta property="og:site_name" content='KawazST Blog' />
              </Head>
            );
          }
        })()}
        {(() => {
          if (!this.state.title) {
            return <Header text="KawazST Blog" onLoad />;
          }
          else {
            return (
              <div>
                <Header text='KawazST Blog' />
                <Grid container spacing={16}>
                  <Grid item>
                    <Link route='/blogs'>
                      <Button variant='outlined'>
                        一覧に戻る
            </Button>
                    </Link>
                  </Grid>
                  {(() => {
                    if (this.state.viewerUid === this.state.author) {
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
                          {this.state.title}
                        </Typography>
                        <Typography variant='subtitle2' gutterBottom>
                          {`${this.state.date}   by ${this.state.authorName}`}
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
                        <Typography variant='body2'>
                          {processor.processSync(this.state.text).contents}
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