import React from 'react';
import PropTypes from 'prop-types';

export default class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div className="navbar">
                    <h1 id="title">Gravitational Lensing by Cluster Simulator</h1>
                    <nav>
                        <ul>
                            {/* needs work */}
                            <li><a href="#" onClick={this.props.onReset}>Reset</a></li>
                            <li><a href="#">Help</a></li>
                            <li><a href="#">About</a></li>
                        </ul>
                    </nav>
                </div>
            </React.Fragment>
        );
    }
}