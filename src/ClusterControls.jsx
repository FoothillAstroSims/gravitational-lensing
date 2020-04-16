import React from 'react';
import PropTypes from 'prop-types';
import SingleVariableControl from './SingleVariableControl.jsx';

export default class ClusterControls extends React.Component {
    constructor(props) {
        super(props);
        this.handleSingleVariableChange = this.handleSingleVariableChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    render() {
        let buttonValue = this.props.settings.showCluster ? 'Hide cluster' : 'Show cluster';
        
        return (
            <React.Fragment>
                <h2>Cluster Controls</h2>
                <button onClick={this.handleButtonClick.bind(this)} >
                    {buttonValue}
                </button>
                {
                    this.props.settings.showCluster && 
                    <div className="controls">
                        <br/><br/>
                        <SingleVariableControl
                            name="clusterMass"
                            displayName="Cluster mass (solar units)"
                            min={0}
                            max={20}
                            minLabel="low"
                            maxLabel="high"
                            step={1}
                            decimals={0}
                            value={this.props.settings.clusterMass}
                            onChange={this.handleSingleVariableChange}
                        />
                        <br/><br/>
                        <SingleVariableControl
                            name="clusterDistance" 
                            displayName="Cluster distance (parsecs)"
                            min={1}
                            max={5}
                            minLabel="near"
                            maxLabel="far"
                            step={0.01}
                            decimals={2}
                            value={this.props.settings.clusterDistance}
                            onChange={this.handleSingleVariableChange}
                        />
                        <br/><br/>
                    </div>
                }
            </React.Fragment>
        );
    }

    handleButtonClick() {
        this.props.onChange({
            ...this.props.settings,
            showCluster: !this.props.settings.showCluster
        });
    }

    /*
    handleChange(newParams) {
        this.props.onChange(newParams);
    }
    */

    handleSingleVariableChange(key, value) {
        this.props.onChange({
            ...this.props.settings,
            [key]: value
        });
    }

}


ClusterControls.propTypes = {
    settings: PropTypes.exact({
        showCluster: PropTypes.bool.isRequired,
        clusterMass: PropTypes.number.isRequired,
        clusterDistance: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired
};
