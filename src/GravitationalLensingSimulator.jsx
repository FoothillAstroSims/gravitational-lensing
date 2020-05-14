import React from 'react';
import NavigationBar from './NavigationBar.jsx';
import MainView from './MainView.jsx';
import ClusterControls from './ClusterControls.jsx';

export default class GravitationalLensingSimulator extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                clusterMass: 50,
                clusterDist: 5,
                sourceDist: 10,
                sourceOffset: 0,
                showCluster: false, 
                showDirectPath: true,
                showOriginalPath: false,
                beta: 0.00,
                y1: 0.00,
                y2: 0.00,
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
                        <div id="data">
                            <p>&nbsp;Source distance:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.sourceDist} billion light years
                                </span>
                            </p>
                            <p>&nbsp;Source offset:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.sourceOffset != 0 ? (this.state.parameters.sourceOffset > 0 ? this.state.parameters.sourceOffset + " thousand light years (right)" : -this.state.parameters.sourceOffset + " thousand light years (left)") : "N/A"}
                                </span>
                            </p>
                            <p>&nbsp;Cluster distance:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.showCluster ? this.state.parameters.clusterDist + " billion light years" : "N/A"}
                                </span>
                            </p>
                            <p>&nbsp;Cluster mass:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.showCluster ? this.state.parameters.clusterMass + " trillion solar masses" : "N/A"}
                                </span>
                            </p>
                            <p>&nbsp;Source offset angle:&nbsp;
                                <span class="highlight">
                                    {Number.parseFloat(this.state.parameters.beta).toFixed(2)} degrees
                                </span>
                            </p>
                            <p>&nbsp;Original ray offset:<br/>
                                <span class="highlight">
                                    &nbsp;{(this.state.parameters.showOriginalPath && this.state.parameters.showCluster) ? (Number.parseFloat(this.state.parameters.y1 / 1000).toFixed(2) + " thousand light years (left)") : "N/A"}
                                </span>
                                <br/>
                                <span class="highlight">
                                    &nbsp;{(this.state.parameters.showOriginalPath && this.state.parameters.showCluster) ? (Number.parseFloat(-this.state.parameters.y2 / 1000).toFixed(2) + " thousand light years (right)") : ""}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="box">
                        <ClusterControls
                            params={this.state.parameters}
                            onChange={this.handleNewParameters.bind(this)}
                        />
                        <div id="survey">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <button type="button" className="btn btn=warning" id="feedback"><strong>Give us feedback!</strong></button>
                            </a>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleNewParameters(newParams) {
        // distance to source must be greater than/equal to distance to cluster + 1
        if (newParams.sourceDist < newParams.clusterDist + 1)
            newParams.sourceDist = newParams.clusterDist + 1;

        this.setState({ parameters: newParams });
    }
    
    handleReset() {
        this.setState(this.initialState);
    }
    
}
