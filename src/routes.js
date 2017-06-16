'use strict';

import React from 'react';
import App from './components/app.component';
import HomePage from './components/pages/home/home.page';
import AboutPage from './components/pages/about/about.page';
import {Route} from 'react-router-dom';

const Routes = (props) => (
    <App>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/about" component={AboutPage}/>
    </App>
);

export default Routes;
