import React from 'react';
import NavigationBar from './NavigationBar.jsx';
import MainView from './MainView.jsx';
import ClusterControls from './ClusterControls.jsx';

export default class GravitationalLensingSimulator extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            settings: {
                showCluster: false,  // task: make it reset if showCluster is false
                clusterMass: 5,
                clusterDistance: 5
            }
        };
        this.state = this.initialState;

        this.handleNewSettings = this.handleNewSettings.bind(this);
        this.reset = this.reset.bind(this)
    }

    render() {
        return (
            <React.Fragment>
                <div className="box">
                    <NavigationBar
                    onReset={this.reset}
                    />
                </div>
                <div className="wrapper">
                    <div className="box">
                        <MainView 
                            className="MainView"
                            settings={this.state.settings}
                        />
                    </div>
                    <div className="box">
                        <ClusterControls
                            settings={this.state.settings}
                            onChange={this.handleNewSettings.bind(this)}
                            // onReset={this.reset.bind(this)}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleNewSettings(newSettings) {
        this.setState({ settings: newSettings });
    }
    
    reset() {
        this.setState(this.initialState);
    }
    
}
