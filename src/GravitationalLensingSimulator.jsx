import React from 'react';
import NavigationBar from './NavigationBar.jsx';
import MainView from './MainView.jsx';
import ClusterControls from './ClusterControls.jsx';

export default class GravitationalLensingSimulator extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                showCluster: false,  // task: make it reset if showCluster is false
                clusterMass: 1000,
                clusterDist: 500,
                sourceDist: 1000,
                sourceOffset: 15
            }
        };
        this.state = this.initialState;

        this.handleNewParameters = this.handleNewParameters.bind(this);
        this.handleReset = this.handleReset.bind(this)
    }

    render() {
        return (
            <React.Fragment>
                <div className="box">
                    <NavigationBar
                    onReset={this.handleReset.bind(this)}
                    />
                </div>
                <div className="wrapper">
                    <div className="box">
                        <MainView 
                            className="MainView"
                            params={this.state.parameters}
                        />
                    </div>
                    <div className="box">
                        <ClusterControls
                            params={this.state.parameters}
                            onChange={this.handleNewParameters.bind(this)}
                            // onReset={this.reset.bind(this)}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleNewParameters(newParams) {
        // distance to source must be greater than/equal to distance to cluster
        if (newParams.sourceDist < newParams.clusterDist)
            newParams.sourceDist = newParams.clusterDist;

        this.setState({ parameters: newParams });
    }
    
    handleReset() {
        this.setState(this.initialState);
    }
    
}
