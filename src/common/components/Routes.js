import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './App';
import HomePage from '../../pages/home/page';
import TestPage0 from '../../pages/test0/page';
import TestPage1 from '../../pages/test1/page';
import KaraokePage from '../../pages/karaoke/page';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="test0" component={TestPage0} />
    <Route path="test1" component={TestPage1} />
    <Route path="karaoke/:id" component={KaraokePage} />
    <Redirect from='*' to='/'/>
  </Route>
);

