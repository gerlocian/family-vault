'use strict';

import React from 'react';
import {Route, IndexRoute} from 'react-router-dom';
import App from './components/app.component';
import HomePage from './components/pages/home/home.page';
import AboutPage from './components/pages/about/about.page';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage}/>
        <Route path="about" component={AboutPage}/>
    </Route>
);
