'use strict';

import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import {Router, browserHistory} from 'react-router-dom';
import routes from './routes';
import '~bootstrap/dist/css/bootstrap.min.css';

ReactDom.render(
    <Router history={browserHistory} routes={routes}/>,
    document.getElementById('app')
);
