import React, { Component } from 'react';
import { firebaseAuth, firebaseDB} from '../firebase';
import remark from 'remark';
import reactRenderer from 'remark-react';
import { withRouter } from 'next/router';
import { Link,Router } from '../../functions/routes';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Divider from '@material-ui/core/Divider';

import Header from '../components/Header';
import Footer from '../components/Footer';

const blogRef = firebaseDB.ref('blogs');
const processor = remark().use(reactRenderer);
const previewChars = 25;

class BlogEdit extends Component {
  constructor(props) {
    super(props);

    this.accessibility = [
      '公開',
      '下書き',
      '限定公開',
    ]

    this.state = {
      onLoad: true,
      onCreate: true,
      accessibility: this.accessibility[1],
      author: '',
      date: '',
      title: '',
      text: '',
      preview:'',
      error: '',
      onPreview: false,
    }

    this.ref = blogRef.child(this.props.router.query.id);
    if (this.ref === 'new') {
      this.ref = blogRef.push().key;
    }
  }

  componentWillMount() {

    this.ref.once('value', snapshot => {
      let val = snapshot.val();
      if (!val) {
        this.setState({
          onLoad: false,
        });
      }
      else {
        if (this.state.author && val.author !== this.state.author) {
          this.toShow();
        }

        this.setState({
          onLoad: false,
          onCreate: false,
          accessibility: val.accessibility,
          author: val.author,
          date: val.date,
          title: val.title,
          text: val.text,
          preview: val.preview,
        });
      }
    });

    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ author: user.uid });
      }
      else {
        this.toShow();
      }
    });
  }

  deleteArticle() {
    this.ref.set(null, error => {
      if (!error) {
        Router.pushRoute('/blogs');
      }
    });
  }

  onAccessibilityChange(e) {
    this.setState({ accessibility: e.target.value });
  }

  onTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  onTextChange(e) {
    this.setState({ text: e.target.value });
  }

  onPreviewChange(e) {
    let text = e.target.value;
    text = text.slice(0, previewChars - 1);
    this.setState({ preview: text });
  }

  switchPreview() {
    this.setState({ onPreview: !this.state.onPreview });
  }

  onSave() {
    let error = this.getValidationError();
    if (error) {
      console.log('onError');
      this.setState({ error: error });
    }
    else {
      this.setState({ error: '' });

      let preview = this.state.preview.trim();
      if (!preview) {
        preview = this.state.text.slice(0, previewChars - 2);
        if (this.state.text.length > previewChars) {
          preview += '...';
        }
      }

      this.ref.update({
        accessibility: this.state.accessibility,
        author: this.state.author,
        date: this.getToday(),
        time: this.getTime(),
        title: this.state.title,
        text: this.state.text,
        preview: preview,
      }, e => {
        if (e) {
          this.setState({ error: '保存に失敗しました' });
        }
          else {
          Router.pushRoute('/blogs');
        }
      });
    }
  }

  getToday() {
    let today = new Date();
    let month = ('00' + today.getMonth()).slice(-2);
    let day = ('00' + today.getDate()).slice(-2);
    let text = `${today.getFullYear()}/${month}/${day}`;
    return text;
  }

  getTime() {
    let now = new Date();
    let hour = ('00' + now.getHours()).slice(-2);
    let minute = ('00' + now.getMinutes()).slice(-2);
    return `${hour}:${minute}`;
  }

  getValidationError() {
    if (!this.state.title.trim()) {
      return 'タイトルが入力されていません';
    }
    if (!this.state.text.trim()) {
      return '本文が入力されていません';
    }
    return null;
  }

  render() {
    if (this.state.onLoad) {
      return <Header text='GAMMA Blog' onLoad />
    }

    return (
      <div>
        <Header text='GAMMA Blog' />
        <Grid container spacing={16}>
          <Grid item>
            <Link route='blogShow' params={{ id: this.props.router.query.id }}>
            <Button color='primary' variant='outlined'>
              編集をキャンセル
            </Button>
            </Link>
          </Grid>
          {(() => {
            if (!this.state.onCreate) {
              return (
                <Grid item>
                  <Button color='secondary' variant='outlined'
                    onClick={() => this.deleteArticle()} >
                    削除する
                  </Button>
                </Grid>
              );
            }
          })()}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={16}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      value={this.state.accessibility}
                      onChange={e => this.onAccessibilityChange(e)}
                      label='公開設定'
                      variant='outlined'>
                      {this.accessibility.map((option) => (
                        <MenuItem
                          value={option}
                          selected={option === this.state.accessibility}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="タイトル"
                      fullWidth
                      value={this.state.title}
                      onChange={(e) => this.onTitleChange(e)}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="本文(マークダウン対応)"
                      multiline
                      fullWidth
                      value={this.state.text}
                      onChange={e => this.onTextChange(e)}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="紹介文(20文字まで)"
                      helperText="未入力の場合、本文の一部が適用されます"
                      fullWidth
                      value={this.state.preview}
                      onChange={e => this.onPreviewChange(e)}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button color='primary' variant='outlined'
                      onClick={() => this.switchPreview()} >
                      プレビューを見る
              </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button color='secondary' variant='outlined'
                      onClick={() => this.onSave()} >
                      変更を保存
                    </Button>
                    <Typography variant='body1' style={{ color: '#ff0000' }}>
                      {this.state.error}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.onPreview}
          onClose={() => this.switchPreview()}
        >
          <DialogContent>
            <DialogTitle>
              {this.state.title}
            </DialogTitle>
            <DialogContentText>
              {processor.processSync(this.state.text).contents}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.switchPreview()} color="primary">
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
        <Footer />
      </div>
    );
  }
}

export default withRouter(BlogEdit);