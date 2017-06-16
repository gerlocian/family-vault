'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="header clearfix">
                    <nav>
                        <ul className="nav nav-pills pull-right">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                        </ul>
                    </nav>
                    <h3 className="text-muted">Family Vault</h3>
                </div>
                {this.props.children}
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.array.isRequired
};

export default App;
