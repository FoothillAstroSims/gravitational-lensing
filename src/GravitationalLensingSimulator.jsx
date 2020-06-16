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
                showLightAngle: false,
                beta: 0.0,
                theta1: 34.57686,       // init values
                theta2: -34.57686,      // init values
                r1: 167633.236,         // init values
                r2: -167633.236,        // init values
                y1: 0.0,
                y2: 0.0,
                // phi: 0.000186         // init values
            }   
        };
        this.state = this.initialState;

        this.handleNewParameters = this.handleNewParameters.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.onBetaUpdate = this.onBetaUpdate.bind(this);
        this.onY1Update = this.onY1Update.bind(this);
        this.onY2Update = this.onY2Update.bind(this);
        this.onTheta1Update = this.onTheta1Update.bind(this);
        this.onTheta2Update = this.onTheta2Update.bind(this);
        this.onR1Update = this.onR1Update.bind(this);
        this.onR2Update = this.onR2Update.bind(this);
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
                            onBetaUpdate={this.onBetaUpdate.bind(this)}
                            onY1Update={this.onY1Update.bind(this)}
                            onY2Update={this.onY2Update.bind(this)}
                            onTheta1Update={this.onTheta1Update.bind(this)}
                            onTheta2Update={this.onTheta2Update.bind(this)}
                            onR1Update={this.onR1Update.bind(this)}
                            onR2Update={this.onR2Update.bind(this)}
                        />
                        <div id="data">
                            <p>&nbsp;Source distance:&nbsp;&nbsp;
                                <span className="highlight">
                                    {this.state.parameters.sourceDist} billion light years
                                </span>
                            </p>
                            <p>&nbsp;Source offset:&nbsp;&nbsp;
                                <span className="highlight">
                                    {this.state.parameters.sourceOffset != 0 ? (this.state.parameters.sourceOffset > 0 ? this.state.parameters.sourceOffset + " thousand light years (left)" : this.state.parameters.sourceOffset + " thousand light years (right)") : "0 thousand light years"}
                                </span>
                            </p>
                            {
                                this.state.parameters.showCluster &&
                                <div>
                                    <p>&nbsp;Cluster distance:&nbsp;&nbsp;
                                        <span className="highlight">
                                            {this.state.parameters.clusterDist + " billion light years"}
                                        </span>
                                    </p>
                                    <p>&nbsp;Cluster mass:&nbsp;&nbsp;
                                        <span className="highlight">
                                            {this.state.parameters.clusterMass + " trillion solar masses"}
                                        </span>
                                    </p>
                                </div>
                            }
                            {/* <p>&nbsp;Source offset angle &#40;beta&#41;:&nbsp;
                                <span className="highlight">
                                    {Number.parseFloat(this.state.parameters.beta).toFixed(2)} arcseconds
                                </span>
                            </p> */}
                        </div>
                        {
                            (this.state.parameters.showCluster && this.state.parameters.showOriginalPath) &&
                            <div id="debug">
                                {/* <p>&nbsp;theta 1:&nbsp;
                                    <span className="highlight">
                                        {Number.parseFloat(this.state.parameters.theta1).toFixed(3)} arcseconds
                                    </span>
                                </p>
                                <p>&nbsp;theta 2:&nbsp;
                                    <span className="highlight">
                                        {Number.parseFloat(this.state.parameters.theta2).toFixed(3)} arcseconds
                                    </span>
                                </p> */}
                                {/* <p>&nbsp;r1:&nbsp;
                                    <span className="highlight">
                                        {Number.parseFloat(this.state.parameters.r1 / 1000).toFixed(3)} thousand light years
                                    </span>
                                </p>
                                <p>&nbsp;r2:&nbsp;
                                    <span className="highlight">
                                        {Number.parseFloat(this.state.parameters.r2 / 1000).toFixed(3)} thousand light years
                                    </span>
                                </p>
                                <p>&nbsp;phi:&nbsp;
                                    <span className="highlight">
                                        {Number.parseFloat(this.state.parameters.phi).toFixed(6)} radians
                                    </span>
                                </p> */}
                                {
                                    // (this.state.parameters.showOriginalPath && this.state.parameters.showCluster) &&
                                    <p>&nbsp;Original ray offset:<br/>
                                        <span className="highlight">
                                            &nbsp;{Number.parseFloat(this.state.parameters.y1 / 1000).toFixed(1)} thousand light years &#40;left&#41;
                                        </span>
                                        <br/>
                                        <span className="highlight">
                                            &nbsp;{Number.parseFloat(this.state.parameters.y2 / 1000).toFixed(1)} thousand light years &#40;right&#41;
                                        </span>
                                    </p>
                                }
                            </div>
                        }
                            {/* {
                                (this.state.parameters.showLightAngle && this.state.parameters.showCluster) &&
                                <div id="angle">
                                    <p id="angle-text">&#8592;&nbsp;&nbsp;
                                        {Number.parseFloat(this.state.parameters.theta1).toFixed(3)} arcseconds
                                    </p>
                                    <p id="angle-text">
                                        {Number.parseFloat(this.state.parameters.theta2).toFixed(3)} arcseconds
                                    &nbsp;&nbsp;&#8594;</p>
                                </div>
                            } */}
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
        // if (!newParams.showCluster) 
        //     newParams.clusterDist = 1;

        // distance to source must be greater than/equal to distance to cluster + 1
        if (newParams.showCluster && newParams.sourceDist < newParams.clusterDist + 1)
            newParams.sourceDist = newParams.clusterDist + 1;
        

        this.setState({ parameters: newParams });
    }
    
    handleReset() {
        this.setState(this.initialState);
    }
    
    onBetaUpdate(newBeta) {
        if (this.state.parameters.beta !== newBeta) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    beta: newBeta
                }
            });
        }
    }
    
    onTheta1Update(newTheta1) {
        if (this.state.parameters.theta1 !== newTheta1 && this.state.parameters.showCluster) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    theta1: newTheta1
                }
            });
        }
    }

    onTheta2Update(newTheta2) {
        if (this.state.parameters.theta2 !== newTheta2 && this.state.parameters.showCluster) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    theta2: newTheta2
                }
            });
        }
    }

    onR1Update(newR1) {
        if (this.state.parameters.r1 !== newR1 && this.state.parameters.showCluster) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    r1: newR1
                }
            });
        }
    }
    
    onR2Update(newR2) {
        if (this.state.parameters.r2 !== newR2 && this.state.parameters.showCluster) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    r2: newR2
                }
            });
        }
    }

    onY1Update(newY1) {
        if (this.state.parameters.y1 !== newY1 && this.state.parameters.showCluster) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    y1: newY1
                }
            });
        }
    }

    onY2Update(newY2) {
        if (this.state.parameters.y2 !== newY2 && this.state.parameters.showCluster) { 
            this.setState({
                parameters: {
                    ...this.state.parameters,
                    y2: newY2
                }
            });
        }
    }

}
