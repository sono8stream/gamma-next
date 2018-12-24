import React from 'react';
import { Router } from '../../functions/routes';

export default class Home extends React.Component {

  componentDidMount() {
    Router.pushRoute('blogs');
  }

  render() {
    return null;
  }
}