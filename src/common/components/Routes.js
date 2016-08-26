import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import HomePage from '../../pages/home/page';
import KaraokePage from '../../pages/karaoke/page';

var path = "/";

if(window.location.href.indexOf('github') >= 0) {
  path = path + 'typography-karaoke/';
}

export default (
  <Route path={ path } component={App}>
    <IndexRoute component={HomePage} />
    <Route path="karaoke/:id" component={KaraokePage} />
  </Route>
);
