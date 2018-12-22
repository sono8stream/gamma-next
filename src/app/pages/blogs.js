import React, { Component } from 'react';
import { firebaseAuth, firebaseDB } from '../firebase';
import { Link } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Header from '../components/Header';
import Footer from '../components/Footer';

const blogRef = firebaseDB.ref('blogs');

export default class Blog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loadCompleted: false,
      uid: undefined,
    };
    //document.body.className = "body";
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
        newArticles.sort((a, b)=> {
          if (a.date+a.time > b.date+b.time) {
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

          <Grid container spacing={16}>
            {(() => {
              if (this.state.uid) {
                return (
                  <Grid item xs={12}>
                    <Link route='blogEdit' params={{ id: 'new' }}>
                      <Button color='secondary' variant='outlined'>
                        新しく書く
                    </Button>
                    </Link>
                  </Grid>
                );
              }
            })()}
            {this.state.articles.map((a, i) => {
              if (a.accessibility === '公開'
                || (a.accessibility === '限定公開' && this.state.uid)
                || this.state.uid === a.author) {
                return (
                  <Grid item xs={12} key={i}>
                    <Card>
                      <Link route='blogShow' params={{ id: a.id }}>
                      <CardActionArea>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            {`${a.date}   by ${a.authorName}`}
                          </Typography>
                          <Typography variant="h6">
                            {a.title}
                          </Typography>
                          <Divider light />
                          <br />
                          <Typography variant="body1">
                            {a.preview}
                          </Typography>
                        </CardContent>
                        </CardActionArea>
                        </Link>
                    </Card>
                  </Grid>
                );
              }
            }
            )}
          </Grid>
          <Footer />
        </div>
      );
    }
  }
}