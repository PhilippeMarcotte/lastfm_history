// Routes.js
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import FullAlbum from './Albums/FullAlbum.js';

export default () => (
  <Switch>
    <Route exact path="/album/:album/artist/:artist" component={FullAlbum}/>
  </Switch>
);