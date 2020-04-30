import React from 'react';
import PropTypes from 'prop-types';
import SingleVariableControl from './utils/SingleVariableControl.jsx';

export default class ClusterControls extends React.Component {
    constructor(props) {
        super(props);
        this.handleSingleVariableChange = this.handleSingleVariableChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    render() {
        let buttonValue = this.props.params.showCluster ? 'Hide cluster' : 'Show cluster';
        
        return (
            <React.Fragment>
                <h2 id="settings">Settings</h2>
                <button onClick={this.handleButtonClick.bind(this)} >
                    {buttonValue}
                </button>
                {
                    this.props.params.showCluster && 
                    <div className="controls">
                        <br/>
                        <fieldset>
                            <br/>
                            <SingleVariableControl
                                name="clusterMass"
                                displayName="Cluster mass (billion solar units)"
                                min={100}
                                max={1000}
                                minLabel="low"
                                maxLabel="high"
                                step={10}
                                decimals={0}
                                value={this.props.params.clusterMass}
                                onChange={this.handleSingleVariableChange}
                            />
                            <br/><br/>
                            <SingleVariableControl
                                name="clusterDist" 
                                displayName="Cluster distance (million parsecs)"
                                min={100}
                                max={1000}
                                minLabel="near"
                                maxLabel="far"
                                step={10}
                                decimals={0}
                                value={this.props.params.clusterDist}
                                onChange={this.handleSingleVariableChange}
                            />
                            <br/><br/>
                            <SingleVariableControl
                                name="sourceDist" 
                                displayName="Source distance (million parsecs)"
                                min={100}
                                max={1000}
                                minLabel="near"
                                maxLabel="far"
                                step={10}
                                decimals={0}
                                value={this.props.params.sourceDist}
                                onChange={this.handleSingleVariableChange}
                            />
                            <br/><br/>
                            <SingleVariableControl
                                name="sourceOffset" 
                                displayName="Source offset (hundred parsecs)"
                                min={0}
                                max={250}
                                minLabel="left"
                                maxLabel="right"
                                step={0.01}
                                decimals={2}
                                value={this.props.params.sourceOffset}
                                onChange={this.handleSingleVariableChange}
                            />
                            <br/><br/>
                        </fieldset>
                    </div>
                }
            </React.Fragment>
        );
    }

    handleButtonClick() {
        this.props.onChange({
            ...this.props.params,
            showCluster: !this.props.params.showCluster
        });
    }

    /*
    handleChange(newParams) {
        this.props.onChange(newParams);
    }
    */

    handleSingleVariableChange(key, value) {
        this.props.onChange({
            ...this.props.params,
            [key]: value
        });
    }

}


ClusterControls.propTypes = {
    params: PropTypes.exact({
        showCluster: PropTypes.bool.isRequired,
        clusterMass: PropTypes.number.isRequired,
        clusterDist: PropTypes.number.isRequired,
        sourceDist: PropTypes.number.isRequired,
        sourceOffset: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired
};
