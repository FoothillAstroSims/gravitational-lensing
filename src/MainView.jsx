import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import { path } from 'd3';

const G = 6.67408 / Math.pow(10, 11);
const LIGHT_SPEED = 2.99792458 * Math.pow(10, 8);
const PARSECS = 3.086 * Math.pow(10, 16);
const ARCSEC_PER_RADIAN = 2.0626494196924 * Math.pow(10, 5);
const SUN_MASS = 1.989 * Math.pow(10, 30);

export default class MainView extends React.Component {
    constructor(props) {
        super(props);

        this.resources = {};
        this.dimension = 550;
        // this.start = this.start.bind(this);
        // this.stop = this.stop.bind(this);
        // this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        this.app = new PIXI.Application({
            antialias: true,
            width: this.dimension,
            height: this.dimension,
            backgroundColor: '0x131418'
        });
        //this.app.renderer.plugins.interaction.autoPreventDefault = false;
        //this.app.renderer.view.style["touch-action"] = "auto";
        // this.updateAll(0);
        this.pixiElement.appendChild(this.app.view);

        // this loads all the images
        this.app.loader
            .add('earth', 'img/blue-circle.png')
            .add('realGalaxy', 'img/yellow-spiral.png')
            .add('virtualGalaxy', 'img/purple-spiral.png')
            .add('cluster', 'img/white-oval.png');

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;
            me.earth = me.drawEarth(resources.earth);
            me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, 275, 400 - this.props.params.sourceDist / 3);
            me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, 275, 480);
            // me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, 275, 50);
            // me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, 275, 480);
            // me.virtualGalaxyContainer = me.drawVirtualGalaxy(resources.virtualGalaxy, 200, 50);
            me.rectangle = me.drawRectangle();
            me.description = me.drawLabel('View from Earth', 275, 525);
            me.galaxyText = me.drawLabel('Distant galaxy', 150, 150);
            me.earthText = me.drawLabel('Earth', 150, 300);
            me.midLine = me.drawLine(275, 90, 275, 360);
            me.galaxyLine = me.drawLine(180, 120, 250, 75);
            me.earthLine = me.drawLine(180, 330, 250, 375);
            me.midCluster = me.drawCluster(resources.cluster, 275, 400 - this.props.params.clusterDist / 3);
            me.botCluster = me.drawCluster(resources.cluster, 275, 480);
            me.leftPath = me.drawPath(200, me.midCluster.y);
            me.rightPath = me.drawPath(350, me.midCluster.y);

            // me.start();
        });
    }

    componentWillUnmount(prevProps, prevState) {
        this.app.stop();
    }

    render() {
        return (
            <div 
                className="MainView" 
                ref={(thisDiv) => { this.pixiElement = thisDiv; }} 
            />
        );
    }
    /*
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }
    
    animate() {
        this.updateLine();
        this.frameId = requestAnimationFrame(this.animate);
    }
    */
    drawEarth(earthResource) {
        const earthContainer = new PIXI.Container();
        // earthContainer.name = "earth";
        earthContainer.position = new PIXI.Point(275, 400);
        earthContainer.pivot = new PIXI.Point(275, 400);

        const earth = new PIXI.Sprite(earthResource.texture);
        earth.position = new PIXI.Point(275, 400);
        earth.anchor.set(0.5);
        earth.width = 25;
        earth.height = 25;
        
        earthContainer.addChild(earth);
        this.app.stage.addChild(earthContainer);
        return earthContainer;
    }

    drawRealGalaxy(galaxyResource, x, y) {
        const realGalaxyContainer = new PIXI.Container();
        // realGalaxyContainer.name = "realGalaxy";
        realGalaxyContainer.position = new PIXI.Point(x, y);
        realGalaxyContainer.pivot = new PIXI.Point(x, y);

        const realGalaxy = new PIXI.Sprite(galaxyResource.texture);
        realGalaxy.position = new PIXI.Point(x, y);
        realGalaxy.anchor.set(0.5);
        realGalaxy.width = 50;
        realGalaxy.height = 30;
        
        realGalaxyContainer.addChild(realGalaxy);
        this.app.stage.addChild(realGalaxyContainer);
        return realGalaxyContainer;
    }

    drawVirtualGalaxy(galaxyResource, x, y) {
        const virtualGalaxyContainer = new PIXI.Container();
        // virtualGalaxyContainer.name = "virtualGalaxy";
        virtualGalaxyContainer.position = new PIXI.Point(x, y);
        virtualGalaxyContainer.pivot = new PIXI.Point(x, y);

        const virtualGalaxy = new PIXI.Sprite(galaxyResource.texture);
        virtualGalaxy.position = new PIXI.Point(x, y);
        virtualGalaxy.anchor.set(0.5);
        virtualGalaxy.width = 50;
        virtualGalaxy.height = 30;
        
        virtualGalaxyContainer.addChild(virtualGalaxy);
        this.app.stage.addChild(virtualGalaxyContainer);
        return virtualGalaxyContainer;
    }

    drawRectangle() {
        const rectangle = new PIXI.Graphics();
        // line width, line color
        rectangle.lineStyle(2, 0xFFFFFF);
        // top left x, top left y, width, height
        rectangle.drawRect(75, 450, 400, 60); 

        this.app.stage.addChild(rectangle);
        return rectangle;
    }

    drawLabel(text, x, y) {
        const description = new PIXI.Text(text, {
            fontFamily: 'Exo',
            fontSize: 18,
            fill: 0xFFFFFF
        });

        description.resolution = 2;
        description.anchor.set(0.5);
        description.position = new PIXI.Point(x, y);

        this.app.stage.addChild(description);
        return description;
    }

    drawLine(x1, y1, x2, y2) {
        const line = new PIXI.Graphics();
        line.lineStyle(2, 0xFFFFFF);
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);

        this.app.stage.addChild(line);
        return line;
    }

    drawCluster(clusterResource, x, y) {
        const clusterContainer = new PIXI.Container();
        clusterContainer.position = new PIXI.Point(x, y);
        clusterContainer.pivot = new PIXI.Point(x, y);

        let r = Math.PI * 2;  // arbitrary initial value for r
        for (let i = 0; i < 20; i++) {
            const cluster = new PIXI.Sprite(clusterResource.texture); 
            cluster.position = new PIXI.Point(x + r * Math.sin(i), y + r * Math.cos(i));
            cluster.anchor.set(0.5);
            cluster.width = 5;
            cluster.height = 8;
            cluster.rotation = i;
            cluster.visible = false;
            clusterContainer.addChild(cluster);
            r++;
        }
        this.app.stage.addChild(clusterContainer);
        return clusterContainer;
    }

    drawPath(x, y) {
        const pathToObject = new PIXI.Graphics();
        const pathToEarth = new PIXI.Graphics();

        pathToObject.lineStyle(2, 0xFFFFFF);
        pathToObject.moveTo(275, 400 - this.props.params.sourceDist / 3);
        pathToObject.lineTo(x, y);
        pathToObject.visible = false;

        pathToObject.lineStyle(2, 0xFFFFFF);
        pathToObject.moveTo(x, y);
        pathToObject.lineTo(275, 400);
        pathToObject.visible = false;

        this.app.stage.addChild(pathToObject);

        return pathToObject;
    }
    // You don't need an animate function. In fact, componentDidUpdate()
    // is much better since it's controlled by React (and probably more efficient)
    // componentDidUpdate() essentially runs every time the parent (in this case, main.jsx) has its state variables
    // changed. Since you passed in the parameters, it will run every time parameters gets changed
    componentDidUpdate() {
        this.updateLine();
        this.updateText();
        this.updateCluster();
        this.updatePaths();
    }

    updateLine() {
        /**
         * This is what you had before.
         */
        // if (this.props.params.showCluster) {
        //     this.line.clear();
        // } else {
        //     this.drawLine();
        // }

        // This works for anything :)
        this.midLine.visible = !this.props.params.showCluster;
        this.galaxyLine.visible = !this.props.params.showCluster;
        this.earthLine.visible = !this.props.params.showCluster;
        this.leftPath.visible = this.props.params.showCluster;
        this.leftPath.visible = this.props.params.showCluster;
        this.rightPath.visible = this.props.params.showCluster;
        this.rightPath.visible = this.props.params.showCluster;
    }

    updateText() {
        this.galaxyText.visible = !this.props.params.showCluster;
        this.earthText.visible = !this.props.params.showCluster;
    }

    updateCluster() {
        for (let i = 0; i < 20; i++) {
            if (this.props.params.showCluster && i < this.props.params.clusterMass / 50) {
                this.midCluster.children[i].visible = true;
                this.botCluster.children[i].visible = true;
            } else {
                this.midCluster.children[i].visible = false;
                this.botCluster.children[i].visible = false;
            }
        }
        
        this.midCluster.y = 400 - this.props.params.clusterDist / 3;
        this.botCluster.scale = new PIXI.Point(100 / this.props.params.clusterDist, 100 / this.props.params.clusterDist);
    }

    updatePaths() {
        const mass = this.props.params.clusterMass * 1000000000;
        const clusterDist = this.props.params.clusterDist * 1000000;
        const sourceDist = this.props.params.sourceDist * 1000000;
        const offset = this.props.params.sourceOffset * 100;

        let beta = Math.atan2(offset, sourceDist) * ARCSEC_PER_RADIAN;
        console.log('source offset angle', beta);

        // calculations 
        let angle = beta / ARCSEC_PER_RADIAN;
        let omega = (4 * G * mass * SUN_MASS) / Math.pow(LIGHT_SPEED, 2);

        let rad_term = Math.pow((Math.pow(angle, 2) + 4 * omega * (sourceDist - clusterDist) / (sourceDist * clusterDist * PARSECS)), 0.5);
        let theta1 = (angle + rad_term) / 2;
        let theta2 = (angle - rad_term) / 2;
        console.log('theta1, theta2, check beta', theta1 * ARCSEC_PER_RADIAN, theta2 * ARCSEC_PER_RADIAN, (theta1 + theta2) * ARCSEC_PER_RADIAN, beta);


        let r1 = clusterDist * Math.tan(theta1);
        let r2 = clusterDist * Math.tan(theta2);
        console.log ('r1, r2', r1, r2);


        let phi = omega / (r1 * PARSECS);
        console.log('phi (rad, degrees)', phi, phi * 180 / Math.PI);


        // calculate how far off to the side the observed light would have landed
        let alpha = Math.atan2(offset - r2, sourceDist - clusterDist);
        console.log(alpha, alpha * 180 / Math.PI);

        let y1 = offset - sourceDist * Math.tan(theta1 - phi);
        let y2 = offset - sourceDist * Math.sin(alpha);
        console.log('original ray offset', y1, y2);
        

        this.leftPath.clear();
        this.leftPath.clear();
        this.rightPath.clear();
        this.rightPath.clear();

        this.leftPath.lineStyle(2, 0xFFFFFF);
        this.leftPath.lineStyle(2, 0xFFFFFF);
        this.rightPath.lineStyle(2, 0xFFFFFF);
        this.rightPath.lineStyle(2, 0xFFFFFF);

        this.leftPath.moveTo(275, 400 - this.props.params.sourceDist / 3);
        this.leftPath.lineTo(275 + r2/100, this.midCluster.y);
        this.leftPath.moveTo(275 + r2/100, this.midCluster.y);
        this.leftPath.lineTo(275, 400);

        this.rightPath.moveTo(275, 400 - this.props.params.sourceDist / 3);
        this.rightPath.lineTo(275 + r1/100, this.midCluster.y);
        this.rightPath.moveTo(275 + r1/100, this.midCluster.y);
        this.rightPath.lineTo(275, 400);
    }
}

