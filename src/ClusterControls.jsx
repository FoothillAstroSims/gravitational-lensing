import React from 'react';
import PropTypes from 'prop-types';
import SingleVariableControl from './utils/SingleVariableControl.jsx';

export default class ClusterControls extends React.Component {
    constructor(props) {
        super(props);
        this.handleSingleVariableChange = this.handleSingleVariableChange.bind(this);
        this.changeCluster = this.changeCluster.bind(this);
        this.changeDirectPath = this.changeDirectPath.bind(this);
        this.changeOriginalPath = this.changeOriginalPath.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    render() {
        let buttonValue = this.props.params.showCluster ? 'Destroy cluster' : 'Create cluster';
        
        return (
            <React.Fragment>
                <h4 id="settings"><strong>Settings</strong></h4>
                <button type="button" id="cluster-control" onClick={this.changeCluster.bind(this)} >
                    {buttonValue}
                </button>
                <div className="controls">
                    <br/>
                    <fieldset class="reset-this redo-fieldset">
                        <br/>
                        <SingleVariableControl
                            name="sourceDist" 
                            displayName="Source distance (billion light years)"
                            min={2}
                            max={10}
                            minLabel="near&nbsp;"
                            maxLabel="&nbsp;far"
                            step={0.1}
                            decimals={1}
                            value={this.props.params.sourceDist}
                            onChange={this.handleSingleVariableChange}
                        />
                        <br/><br/>
                        <SingleVariableControl
                            name="sourceOffset" 
                            displayName="Source offset (thousand light years)"
                            min={-500}
                            max={500}
                            minLabel="left&nbsp;"
                            maxLabel="&nbsp;right"
                            step={1}
                            decimals={1}
                            value={this.props.params.sourceOffset}
                            onChange={this.handleSingleVariableChange}
                        />
                        <br/><br/>
                        {
                            this.props.params.showCluster &&
                            <React.Fragment>
                                <SingleVariableControl
                                    name="clusterDist" 
                                    displayName="Cluster distance (billion light years)"
                                    min={1}
                                    max={9}
                                    minLabel="near&nbsp;"
                                    maxLabel="&nbsp;far"
                                    step={0.1}
                                    decimals={1}
                                    value={this.props.params.clusterDist}
                                    onChange={this.handleSingleVariableChange}
                                />
                                <br/><br/>
                                <SingleVariableControl
                                    name="clusterMass"
                                    displayName="Cluster mass (trillion solar masses)"
                                    min={0}
                                    max={100}
                                    minLabel="low&nbsp;"
                                    maxLabel="&nbsp;high"
                                    step={5}
                                    decimals={1}
                                    value={this.props.params.clusterMass}
                                    onChange={this.handleSingleVariableChange}
                                />
                                <br/><br/>
                            </React.Fragment>
                        }
                    </fieldset>
                    <form class="directPath">
                        <div class="custom-control custom-checkbox">
                            <input 
                                type="checkbox" 
                                class="custom-control-input" 
                                id="directPath"
                                name="showDirectPath"
                                onChange={this.changeDirectPath.bind(this)}
                                checked={this.props.params.showDirectPath} 
                            />
                            <label class="custom-control-label" htmlFor="directPath">Show direct path to galaxy</label>
                        </div>
                    </form>
                    {
                        this.props.params.showCluster &&
                        <form class="originalPath">
                            <div class="custom-control custom-checkbox">
                                <input 
                                    type="checkbox" 
                                    class="custom-control-input" 
                                    id="originalPath" 
                                    name="showOriginalPath"
                                    onChange={this.changeOriginalPath.bind(this)}
                                    checked={this.props.params.showOriginalPath}
                                />
                                <label class="custom-control-label" htmlFor="originalPath">Show original paths of light</label>
                            </div>
                        </form>
                    }   
                </div>
            </React.Fragment>
        );
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

    changeCluster() {
        this.props.onChange({
            ...this.props.params,
            showCluster: !this.props.params.showCluster
        });
    }

    changeDirectPath() {
        this.props.onChange({
            ...this.props.params,
            showDirectPath: !this.props.params.showDirectPath
        });
    }

    changeOriginalPath() {
        this.props.onChange({
            ...this.props.params,
            showOriginalPath: !this.props.params.showOriginalPath
        });
    }

}


ClusterControls.propTypes = {
    params: PropTypes.exact({
        clusterMass: PropTypes.number.isRequired,
        clusterDist: PropTypes.number.isRequired,
        sourceDist: PropTypes.number.isRequired,
        sourceOffset: PropTypes.number.isRequired,
        showCluster: PropTypes.bool.isRequired,
        showDirectPath: PropTypes.bool.isRequired,
        showOriginalPath: PropTypes.bool.isRequired,
        beta: PropTypes.number.isRequired,
        y1: PropTypes.number.isRequired,
        y2: PropTypes.number.isRequired
    }).isRequired,
    onChange: PropTypes.func.isRequired
};
