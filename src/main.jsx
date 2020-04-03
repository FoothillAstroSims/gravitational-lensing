import React from 'react';
import ReactDOM from 'react-dom';
import Redshift from './Redshift';
import NavBar from "./UserControls/NavBar";
import Parameters from "./UserControls/Parameters";
import Chart from "./D3/components/Chart";
import Legend from "./D3/components/Legend";

class CosmologicalRedshiftSim extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            parameters: {
                initialSeparationDistance: 6.50,
                expansionRate: 10,
            },

            // graphDisplayed: false,
            graphDisplayed: true,

            times: [0],
            targetDistances: [6.50],
            lightDistances: [6.50],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [6.50],
            completeLightDistances: [6.50],
            completeLightTravelledDistances: [0],

            animationRate: 20,
            startBtnText: 'play animation',
            isPlaying: false,
            simulationStarted: false,
            simulationEnded: false,

            distanceTravelledLight: 6.50,
            distanceBetweenBodies: 6.50,

            index: 0,
            maxIndex: 0,
        };


        this.state = this.initialState;
        this.raf = null;

        this.stopAnimation = this.stopAnimation.bind(this);
    }

    render() {
        return <React.Fragment>
            <NavBar
                onResetClick={this.onResetClick.bind(this)}
            />

            <div>
                <Redshift
                    params={this.state.parameters}
                    distanceTravelledLight={this.state.distanceTravelledLight}
                    distanceBetweenBodies={this.state.distanceBetweenBodies}
                    isPlaying={this.state.isPlaying}
                    simulationStarted={this.state.simulationStarted}
                    changeSimState={() => { this.changeSimState() }}
                />
            </div>


            <div className="animationButton">
                <button type="box"
                    className="btn btn-danger btn-sm"
                    onClick={() => this.onStartClick()}>
                    {this.state.startBtnText}
                </button>
            </div>

            <div className="parameters">
                <Parameters
                    params={this.state.parameters}
                    onChange={this.handleNewParameters.bind(this)}
                    simulationStarted={this.state.simulationStarted}
                    simulationEnded={this.state.simulationEnded}
                    isPlaying={this.state.isPlaying}
                />
            </div>

            <div className="checkBox">
                <input type="checkbox"
                    onChange={() => this.displayGraph()}
                    checked={this.state.graphDisplayed}
                    id="graphDisplay"
                />
                <label className="checkBoxText" htmlFor="graphDisplay" id="text">
                    Display Graph
                </label>
            </div>

            <div id="chart">
                <Chart
                    lightValues={this.state.lightTravelledDistances}
                    targetDistances={this.state.targetDistances}
                    lightDistances={this.state.lightDistances}
                    times={this.state.times}
                    displayGraph={this.state.graphDisplayed}
                />
            </div>

            <div id="legend">
                <Legend
                    displayGraph={this.state.graphDisplayed}
                />
            </div>

            <div className="animationSlider">
                <h6 id="animationSpeedText">Animation </h6>
                <h6 id="animationSpeedTextLineTwo">Speed</h6>
                <input
                    type="range"
                    min={5}
                    max={100}
                    step={1}
                    value={this.state.animationRate}
                    onChange={this.changeAnimationRate.bind(this)}
                />
            </div>

        </React.Fragment>;
    }

    componentDidMount() {
        this.calculateData();
    }

    displayGraph(e) {
        console.log(`displayGraph: ${this.state.graphDisplayed}`);
        this.setState({
            graphDisplayed: !this.state.graphDisplayed
        });
    }

    calculateData() {
        let dt = 0.001;
        let expansion_rate = this.state.parameters.expansionRate / 100;
        let current_time = this.state.times[this.state.times.length - 1];

        let current_separation = this.state.targetDistances[this.state.targetDistances.length - 1];
        let light_travel_distance = this.state.lightTravelledDistances[this.state.lightTravelledDistances.length - 1];
        let distance_to_light = this.state.lightDistances[this.state.lightDistances.length - 1];

        let index = this.state.index;

        let timeLines = this.state.completeTimes.slice(0, index);
        let target_distances = this.state.completeTargetDistances.slice(0, index);
        let light_distances = this.state.completeLightDistances.slice(0, index);
        let light_traveled_distances = this.state.completeLightTravelledDistances.slice(0, index);

        let maxSimIndex = this.state.index;
        while ((distance_to_light > 0) && maxSimIndex < 200000) {
            current_separation += current_separation * expansion_rate * dt;
            distance_to_light += distance_to_light * expansion_rate * dt;

            distance_to_light -= dt;
            light_travel_distance = light_travel_distance + dt;

            current_time += dt;

            timeLines.push(current_time);
            target_distances.push(current_separation);
            light_distances.push(distance_to_light);
            light_traveled_distances.push(light_travel_distance);

            maxSimIndex += 1;
        }

        this.setState({
            completeTimes: timeLines,
            completeTargetDistances: target_distances,
            completeLightDistances: light_distances,
            completeLightTravelledDistances: light_traveled_distances,
            maxIndex: maxSimIndex,

            lightTravelledDistances: this.state.lightTravelledDistances.slice(0, this.state.index + 1),
            targetDistances: this.state.targetDistances.slice(0, this.state.index + 1),
            lightDistances: this.state.lightDistances.slice(0, this.state.index + 1),
            times: this.state.times.slice(0, this.state.index + 1),
        });
    }

    handleNewParameters(newParams) {
        this.setState({ parameters: newParams });

        if (!this.state.simulationStarted) {
            this.setState({
                completeTargetDistances: [newParams.initialSeparationDistance],
                completeLightDistances: [newParams.initialSeparationDistance],

                targetDistances: [newParams.initialSeparationDistance],
                lightDistances: [newParams.initialSeparationDistance],

                distanceBetweenBodies: newParams.initialSeparationDistance,
                distanceTravelledLight: newParams.initialSeparationDistance,
            })
        }
    }

    animate() {
        if (this.state.simulationEnded) return;

        let index = this.state.index;

        this.state.targetDistances.push(this.state.completeTargetDistances[index]);
        this.state.lightDistances.push(this.state.completeLightDistances[index]);
        this.state.lightTravelledDistances.push(this.state.completeLightTravelledDistances[index]);
        this.state.times.push(this.state.completeTimes[index]);

        // let speedOfAnimation = this.state.animationRate;
        let speedOfAnimation = 100;
        console.log(`animation rate ${this.state.animationRate}`);
        console.log(`distbwBodies rate ${this.state.completeTargetDistances[index + speedOfAnimation]}`);
        if (this.state.isPlaying) {
            this.setState({
                distanceTravelledLight: this.state.completeLightDistances[index],
                distanceBetweenBodies: this.state.completeTargetDistances[index],

                simulationStarted: true,

                targetDistances: this.state.targetDistances,
                lightDistances: this.state.lightDistances,
                lightTravelledDistances: this.state.lightTravelledDistances,
                times: this.state.times,

                // index: this.state.index + this.state.animationRate,
                // simulationEnded: index >= this.state.maxIndex - (this.state.animationRate + 1)

                index: this.state.index + speedOfAnimation,
                simulationEnded: index >= this.state.maxIndex - (speedOfAnimation + 1),
            });
        }

        this.raf = requestAnimationFrame(this.animate.bind(this));
    }

    onStartClick() {
        if (!this.state.isPlaying) {
            this.calculateData();
            this.raf = requestAnimationFrame(this.animate.bind(this));
            this.setState({
                isPlaying: true,
                startBtnText: 'pause animation'
            });
        } else {
            this.stopAnimation();
            this.setState({
                isPlaying: false,
                startBtnText: 'play animation'
            });
        }
    }

    changeAnimationRate(event) {
        this.setState({
            animationRate: event.target.value,
        })
    }

    stopAnimation() {
        cancelAnimationFrame(this.raf);
    }

    onResetClick(e) {
        e.preventDefault();
        this.stopAnimation();
        this.setState(this.initialState);

        // Reset the array values
        this.setState({
            times: [0],
            targetDistances: [6.50],
            lightDistances: [6.50],
            lightTravelledDistances: [0],

            completeTimes: [0],
            completeTargetDistances: [6.50],
            completeLightDistances: [6.50],
            completeLightTravelledDistances: [0],
        });
    }
}

const domContainer = document.querySelector('#sim-container');
ReactDOM.render(<CosmologicalRedshiftSim />, domContainer);
