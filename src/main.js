/**
 * App entry point
 */

// Polyfill
import 'babel-polyfill';
import FastClick from 'fastclick';

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory } from 'react-router';

// Routes
import Routes from './common/components/Routes';

// Base styling
import './common/base.css';

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

FastClick.attach(document.body);

var basePath = '/';

if(window.location.href.indexOf('github') >= 0) {
  basePath = basePath + 'typography-karaoke/';
}

const browserHistory = useRouterHistory(createHistory)({
  basename: basePath
});

// Render the router
ReactDOM.render((
  <Router history={browserHistory}>
    {Routes}
  </Router>
), document.getElementById(DOM_APP_EL_ID));

