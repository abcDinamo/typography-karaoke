import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import HomePage from '../../pages/home/page';
import KaraokePage from '../../pages/karaoke/page';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="karaoke/:id" component={KaraokePage} />
    <Redirect from='*' to='/'/>
  </Route>
);

