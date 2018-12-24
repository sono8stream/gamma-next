import React, { Component } from 'react';
import { firebaseAuth, firebaseDB } from '../firebase';
import { Link,href } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { ButtonBase } from '@material-ui/core';

import colors from '../style/themeColor';
import { relative } from 'path';

const blogRef = firebaseDB.ref('blogs');

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loadCompleted: false,
      uid: undefined,
    };
  }

  componentWillMount() {
    //window.scrollTo(0, 0);

    blogRef.on("child_added", (snapshot) => {
      let val = snapshot.val();
      firebaseDB.ref(`accounts/${val.author}`).once('value', account => {
        let newArticles = this.state.articles;
        let name = account.val() ? account.val().name : 'who';
        let title = val.title;
        if (val.accessibility !== '公開') {
          title += ` (${val.accessibility})`;
        }

        newArticles.push({
          id: snapshot.key,
          accessibility: val.accessibility,
          date: val.date,
          time: val.time,
          author: val.author,
          authorName: name,
          preview: val.preview,
          title: title,
        });
        newArticles.sort((a, b) => {
          if (a.date + a.time > b.date + b.time) {
            return -1;
          }
          if (a.date + a.time < b.date + b.time) {
            return 1;
          }
          return 0;
        });
        this.setState({
          articles: newArticles,
          loadCompleted: true,
        });
      });
    });

    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ uid: user.uid });
      }
    });
  }

  render() {
    if (!this.state.loadCompleted) {
      return (
        <Header text="KawazST Blog" onLoad />
      );
    }
    else {
      return (
        <div>
          <Header text="KawazST Blog" />
          {(() => {
            if (this.state.uid) {
              return (
                <Grid container spacing={16} justify="flex-start">
                  <Grid item xs={12}>
                    <Button color='secondary' variant='outlined'
                      href={href('blogEdit', { id: 'new' })}>
                      {'新しく書く'}
                    </Button>
                  </Grid>
                </Grid>
              );
            }
          })()}
          <Grid container spacing={16}
            justify="flex-start"
            alignItems="stretch">
            {this.state.articles.map((a, i) => {
              if (a.accessibility === '公開'
                || (a.accessibility === '限定公開' && this.state.uid)
                || this.state.uid === a.author) {
                return (
                  <Grid item key={i}
                    xs={12} sm={i == 0 ? 12 : 6} md={i == 0 ? 12 : 4}>
                    <ButtonBase key={i} href={href('blogShow', { id: a.id })}
                      style={{
                        width: '100%',
                        height: '100%',
                      }} >
                      <Card
                        style={{
                          width: '100%',
                          height: '100%'
                        }}>
                        <CardContent style={{
                          backgroundColor: colors.primaryDark,
                        }}>
                          <Typography gutterBottom
                            style={{ color: 'white' ,height:2}}                          >
                            {`${a.date}   by ${a.authorName}`}
                          </Typography>
                        </CardContent>
                        <CardContent style={{
                          backgroundColor: colors.primary
                        }}>
                          <Typography variant='h5' align='center'
                            style={{
                              color: 'white',
                              fontSize: '120%',
                            }}>
                            {a.title}
                          </Typography>
                        </CardContent>
                        <CardMedia
                          image='https://gamma-creators.firebaseapp.com/icon.png'
                          style={{ height: 0, paddingTop: '56.25%' }} />
                        <Divider light/>
                        <CardContent>
                          <Typography variant="body1" align='center'>
                            {a.preview}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ButtonBase>
                  </Grid>
                );
              }
            }
            )}
          </Grid>
          <Footer />
        </div >
      );
    }
  }
}