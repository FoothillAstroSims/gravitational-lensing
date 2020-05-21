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
                theta1: 11.526,     // default values
                theta2: -11.526,    // default values
                r1: 279388.724,     // default values
                r2: -279388.724,    // default values
                phi: 0.00011176     // default values
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
                            <p>&nbsp;Source distance &#40;dS&#41;:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.sourceDist} billion light years
                                </span>
                            </p>
                            <p>&nbsp;Source offset &#40;X1&#41;:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.sourceOffset != 0 ? (this.state.parameters.sourceOffset > 0 ? this.state.parameters.sourceOffset + " thousand light years (right)" : this.state.parameters.sourceOffset + " thousand light years (left)") : "N/A"}
                                </span>
                            </p>
                            <p>&nbsp;Cluster distance &#40;dL&#41;:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.showCluster ? this.state.parameters.clusterDist + " billion light years" : "N/A"}
                                </span>
                            </p>
                            <p>&nbsp;Cluster mass &#40;M&#41;:&nbsp;
                                <span class="highlight">
                                    {this.state.parameters.showCluster ? this.state.parameters.clusterMass + " trillion solar masses" : "N/A"}
                                </span>
                            </p>
                            <p>&nbsp;Source offset angle &#40;beta&#41;:&nbsp;
                                <span class="highlight">
                                    {Number.parseFloat(this.state.parameters.beta).toFixed(2)} arcseconds
                                    {/* LEFT = EAST, RIGHT = WEST */}
                                </span>
                            </p>
                            {
                                (this.state.parameters.showOriginalPath && this.state.parameters.showCluster) &&
                                <p>&nbsp;Original ray offset &#40;Y1, Y2&#41;:<br/>
                                    <span class="highlight">
                                        &nbsp;{Number.parseFloat(this.state.parameters.y1 / 1000).toFixed(2)} thousand light years &#40;left&#41;
                                    </span>
                                    <br/>
                                    <span class="highlight">
                                        &nbsp;{Number.parseFloat(this.state.parameters.y2 / 1000).toFixed(2)} thousand light years &#40;right&#41;
                                    </span>
                                </p>
                            }
                        </div>
                        <div id="debug">
                            {
                                (this.state.parameters.showCluster) &&
                                <React.Fragment>
                                    <p>&nbsp;theta 1:&nbsp;
                                        <span class="highlight">
                                            {Number.parseFloat(this.state.parameters.theta1).toFixed(3)} arcseconds
                                        </span>
                                    </p>
                                    <p>&nbsp;theta 2:&nbsp;
                                        <span class="highlight">
                                            {Number.parseFloat(this.state.parameters.theta2).toFixed(3)} arcseconds
                                        </span>
                                    </p>
                                    <p>&nbsp;r1:&nbsp;
                                        <span class="highlight">
                                            {Number.parseFloat(this.state.parameters.r1 / 1000).toFixed(3)} thousand light years
                                        </span>
                                    </p>
                                    <p>&nbsp;r2:&nbsp;
                                        <span class="highlight">
                                            {Number.parseFloat(this.state.parameters.r2 / 1000).toFixed(3)} thousand light years
                                        </span>
                                    </p>
                                    <p>&nbsp;phi:&nbsp;
                                        <span class="highlight">
                                            {Number.parseFloat(this.state.parameters.phi).toFixed(8)} radians
                                        </span>
                                    </p>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                    <div className="box">
                        <ClusterControls
                            params={this.state.parameters}
                            onChange={this.handleNewParameters.bind(this)}
                        />
                        <div id="survey">
                            <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=n7L3RQCxQUyAT7NBighZStjAWTIFlutChq8ZZEGLLMdUNTJKNlVITzlCNTAyNDJFQkwwTlFFNE80Vi4u" target="_blank" rel="noopener noreferrer">
                                <button type="button" className="btn btn=warning" id="feedback">Give us feedback!</button>
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
