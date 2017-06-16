'use strict';

import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import Routes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDom.render(
    <Router>
        <Routes></Routes>
    </Router>,
    document.getElementById('app')
);
