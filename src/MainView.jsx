import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';
import { path, thresholdFreedmanDiaconis } from 'd3';

const G = 6.67408 / Math.pow(10, 11);
const LIGHT_SPEED = 2.99792458 * Math.pow(10, 8);
// const PARSECS_M = 3.086 * Math.pow(10, 16);
const LIGHT_YRS = 9.461 * Math.pow(10, 15);
const ARCSEC_PER_RADIAN = 206264.94196924;
const SUN_MASS = 1.989 * Math.pow(10, 30);

const convertPolarToRect = function(radius, angle, center) {
    return new PIXI.Point(
        radius * Math.cos(angle) + center.x,
        radius * Math.sin(angle) + center.y
    );
}

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
            resolution: Math.min(window.devicePixelRatio, 3) || 1,
            autoDensity: true,
            width: this.dimension,
            height: this.dimension,
            backgroundColor: '0x131418'
        });

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
            me.earth = me.drawEarth(resources.earth);  // me.earth.x = 275
            me.sourceGalaxy = me.drawRealGalaxy(resources.realGalaxy, me.earth.x, 400 - this.props.params.sourceDist * 30);
            me.viewGalaxy = me.drawRealGalaxy(resources.realGalaxy, me.earth.x, 495);
            // me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, this.earth.x, 50);
            // me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, this.earth.x, 480);
            // me.virtualGalaxyContainer = me.drawVirtualGalaxy(resources.virtualGalaxy, 200, 50);
            me.leftGalaxy = me.drawVirtualGalaxy(resources.virtualGalaxy, me.earth.x - me.props.params.theta1 * 3, 495);   // from calculations in updatePaths()
            me.rightGalaxy = me.drawVirtualGalaxy(resources.virtualGalaxy, me.earth.x - me.props.params.theta2 * 3, 495);  // from calculations in updatePaths()
            me.rectangle = me.drawRectangle();
            me.description = me.drawLabel('View from Earth', me.earth.x, 540);
            me.eastText = me.drawLabel('E', 20, 540);
            me.westText = me.drawLabel('W', 530, 540);
            me.earthText = me.drawLabel('Earth', 165, me.earth.y);
            me.galaxyText = me.drawLabel('Distant\ngalaxy', me.sourceGalaxy.x + 115, me.sourceGalaxy.y);
            me.midLine = me.drawLine(me.sourceGalaxy.x, me.sourceGalaxy.y, me.earth.x, me.earth.y);
            me.earthLine = me.drawLine(200, me.earth.y, 250, me.earth.y, 2);
            me.galaxyLine = me.drawLine(me.sourceGalaxy.x + 25, me.sourceGalaxy.y, me.sourceGalaxy.x + 75, me.sourceGalaxy.y, 2);
            me.midCluster = me.drawCluster(resources.cluster, me.earth.x, 400 - this.props.params.clusterDist * 30);
            me.botCluster = me.drawCluster(resources.cluster, me.earth.x, 495);
            me.leftPathEarth = me.drawPath(100, me.midCluster.y, me.earth.x, 400);
            me.rightPathEarth = me.drawPath(450, me.midCluster.y, me.earth.x, 400);
            me.leftPathLight = me.drawLine(me.midCluster.x, me.midCluster.y, me.earth.x, me.earth.y);
            me.rightPathLight = me.drawLine(me.midCluster.x, me.midCluster.y, me.earth.x, me.earth.y);
            me.rightArc = me.drawArc(
                Math.atan2(me.midCluster.y - me.earth.y, (me.earth.x + me.props.params.r1 / 10000) - me.earth.x), 
                Math.atan2(me.sourceGalaxy.y - me.earth.y, me.sourceGalaxy.x - me.earth.x), 
                true
            );
            me.leftArc = me.drawArc(
                Math.atan2(me.midCluster.y - me.earth.y, (me.earth.x + me.props.params.r2 / 10000) - me.earth.x), 
                Math.atan2(me.sourceGalaxy.y - me.earth.y, me.sourceGalaxy.x - me.earth.x), 
                false
            );
            me.rightArcArrow = me.drawArrow();  // temp location
            me.leftArcArrow = me.drawArrow();   // temp location

            me.betaLine = me.drawLine(me.botCluster.x, 465, me.botCluster.x, 465, 2, "0xe9c452");
            me.rightLine = me.drawLine(me.botCluster.x, 525, me.botCluster.x, 525, 2, "0xa1a0da");
            me.leftLine = me.drawLine(me.botCluster.x, 525, me.botCluster.x, 525, 2, "0xa1a0da");

            me.betaText = me.drawLabel("0.0 arcseconds", me.botCluster.x, 445, 15, "0xe9c452");
            me.leftText = me.drawLabel("11.5 arcseconds", 125, 542, 15, "0xa1a0da", false);
            me.rightText = me.drawLabel("-11.5 arcseconds", 425, 542, 15, "0xa1a0da", false);

            me.betaTick = me.drawLine(me.botCluster.x, 460, me.botCluster.x, 470, 2, "0xe9c452");
            me.thetaTick = me.drawLine(me.botCluster.x, 520, me.botCluster.x, 530, 2, "0xa1a0da", false);

            me.betaArrow = me.drawArrow("0xe8c3c3");
            me.rightArrow = me.drawArrow("0xa1a0da");
            me.leftArrow = me.drawArrow("0xa1a0da");
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
        virtualGalaxyContainer.visible = false;

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
        rectangle.drawRect(0, 465, 550, 60); 

        this.app.stage.addChild(rectangle);
        return rectangle;
    }

    drawLabel(text, x, y, size=16, color="0xffffff", visible=true) {
        const label = new PIXI.Text(text, {
            fontFamily: 'Exo',
            fontSize: size,
            fill: color
        });

        label.resolution = 2;
        label.visible = visible;
        label.anchor.set(0.5);
        label.position = new PIXI.Point(x, y);

        this.app.stage.addChild(label);
        return label;
    }

    drawLine(x1, y1, x2, y2, width=1, color="0xffffff", visible=true) {
        const line = new PIXI.Graphics();

        line.lineStyle(width, color);
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        line.visible = visible;

        this.app.stage.addChild(line);
        return line;
    }

    drawArrow(color="0xe8c3c3") {
        const arrow = new PIXI.Graphics();
        arrow.lineStyle(2, color);

        // if (east) {
        //     arrow.moveTo(tip.x, tip.y);
        //     arrow.lineTo(tip.x - 5, tip.y - 5);
        //     arrow.moveTo(tip.x, tip.y);
        //     arrow.lineTo(tip.x - 5, tip.y + 5);
        // } else {
        //     arrow.moveTo(tip.x, tip.y);
        //     arrow.lineTo(tip.x + 5, tip.y - 5);
        //     arrow.moveTo(tip.x, tip.y);
        //     arrow.lineTo(tip.x + 5, tip.y + 5);
        // }

        this.app.stage.addChild(arrow);
        return arrow;
    }

    drawCluster(clusterResource, x, y) {
        const clusterContainer = new PIXI.Container();
        clusterContainer.position = new PIXI.Point(x, y);
        clusterContainer.pivot = new PIXI.Point(x, y);

        // [x, y, rotation] (hard coded for randomness)
        let coordinates = [
            [x, y, 17], [x - 6, y - 14, 13], [x + 6, y - 12, 3], [x + 9, y + 3, 10],
            [x - 5, y - 6, 18], [x + 2, y - 6, 4], [x + 3, y + 8, 2], [x - 14, y - 7, 12],
            [x + 15, y - 4, 8], [x - 15, y + 3, 11], [x - 9, y - 1, 19], [x + 1, y - 13, 6],
            [x - 5, y + 6, 15], [x + 13, y - 13, 7], [x + 6, y + 14, 5], [x + 15, y + 4, 16],
            [x - 13, y + 12, 1], [x - 3, y + 13, 20], [x + 8, y - 4, 9], [x + 11, y + 10, 14]
        ];

        for (let i = 0; i < 20; i++) {
            const cluster = new PIXI.Sprite(clusterResource.texture);
            cluster.anchor.set(0.5);
            cluster.width = 5;
            cluster.height = 8;
            cluster.visible = false;
            cluster.position = new PIXI.Point(coordinates[i][0], coordinates[i][1]);
            cluster.rotation = coordinates[i][2];
            clusterContainer.addChild(cluster);
        }

        this.app.stage.addChild(clusterContainer);
        return clusterContainer;
    }

    drawPath(x1, y1, x2, y2) {
        const pathToObject = new PIXI.Graphics();

        pathToObject.lineStyle(2, 0xa1a0da);
        pathToObject.moveTo(this.earth.x, 400 - this.props.params.sourceDist * 30);
        pathToObject.lineTo(x1, y1);
        pathToObject.visible = false;

        pathToObject.lineStyle(2, 0xa1a0da);
        pathToObject.moveTo(x1, y1);
        pathToObject.lineTo(x2, y2);
        pathToObject.visible = false;

        this.app.stage.addChild(pathToObject);
        return pathToObject;
    }

    drawArc(startAngle, endAngle, anticlockwise) {
        const arc = new PIXI.Graphics();
        arc.visible = false;

        arc.lineStyle(2, 0xe8c3c3);
        arc.arc(
            this.earth.x,
            this.earth.y,
            45,
            startAngle,
            endAngle,
            anticlockwise
        );

        this.app.stage.addChild(arc);
        return arc;
    }

    // You don't need an animate function. In fact, componentDidUpdate()
    // is much better since it's controlled by React (and probably more efficient)
    // componentDidUpdate() essentially runs every time the parent (in this case, main.jsx) has its state variables
    // changed. Since you passed in the parameters, it will run every time parameters gets changed
    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            this.updateVisibility();
            this.updateCluster();
            this.updateGalaxies();
            this.updatePaths();
            this.updateMidLine();
            this.updateLabels();
            this.updateArcs();
            this.updateViewPort();
        }
    }

    updateVisibility() {
        // this.midLine.visible = !this.props.params.showCluster;
        this.earthLine.visible = !this.props.params.showCluster;
        this.galaxyLine.visible = !this.props.params.showCluster;

        this.earthText.visible = !this.props.params.showCluster;
        this.galaxyText.visible = !this.props.params.showCluster;

        this.leftGalaxy.visible = this.props.params.showCluster;
        this.rightGalaxy.visible = this.props.params.showCluster;

        this.leftPathEarth.visible = this.props.params.showCluster;
        this.leftPathEarth.visible = this.props.params.showCluster;
        this.rightPathEarth.visible = this.props.params.showCluster;
        this.rightPathEarth.visible = this.props.params.showCluster;
        
        this.leftPathLight.visible = this.props.params.showCluster;
        this.leftPathLight.visible = this.props.params.showCluster;
        this.rightPathLight.visible = this.props.params.showCluster;
        this.rightPathLight.visible = this.props.params.showCluster;

        this.leftArc.visible = this.props.params.showCluster;
        this.rightArc.visible = this.props.params.showCluster;
        this.leftArcArrow.visible = this.props.params.showCluster;
        this.rightArcArrow.visible = this.props.params.showCluster;
        
        this.rightText.visible = (this.props.params.showCluster && this.props.params.showLightAngle);
        this.leftText.visible = (this.props.params.showCluster && this.props.params.showLightAngle);
        this.thetaTick.visible = (this.props.params.showCluster && this.props.params.showLightAngle); 
    }
    
    updateCluster() {
        for (let i = 0; i < 20; i++) {
            if (this.props.params.showCluster && i < this.props.params.clusterMass / 5) {
                this.midCluster.children[i].visible = true;
                this.botCluster.children[i].visible = true;
            } else {
                this.midCluster.children[i].visible = false;
                this.botCluster.children[i].visible = false;
            }
        }
        
        this.midCluster.y = this.earth.y - this.props.params.clusterDist * 30;
        this.botCluster.scale = new PIXI.Point(1 / Math.sqrt(this.props.params.clusterDist), 1 / Math.sqrt(this.props.params.clusterDist));
    }

    updatePaths() {
        const mass = this.props.params.clusterMass * 1000000000000;
        const clusterDist = this.props.params.clusterDist * 1000000000;
        const sourceDist = this.props.params.sourceDist * 1000000000;
        const offset = this.props.params.sourceOffset * 1000;

        let beta = Math.atan2(offset, sourceDist) * ARCSEC_PER_RADIAN;
        // console.log('source offset angle', beta);

        // calculations 
        let angle = beta / ARCSEC_PER_RADIAN;
        let omega = (4 * G * mass * SUN_MASS) / Math.pow(LIGHT_SPEED, 2);

        let rad_term = Math.pow((Math.pow(angle, 2) + 4 * omega * (sourceDist - clusterDist) / (sourceDist * clusterDist * LIGHT_YRS)), 0.5);
        let theta1 = (angle + rad_term) / 2;
        let theta2 = (angle - rad_term) / 2;
        // console.log('theta1, theta2, check beta', theta1 * ARCSEC_PER_RADIAN, theta2 * ARCSEC_PER_RADIAN, (theta1 + theta2) * ARCSEC_PER_RADIAN, beta);


        let r1 = clusterDist * Math.tan(theta1);
        let r2 = clusterDist * Math.tan(theta2);
        // console.log ('r1, r2', r1, r2);


        let phi = omega / (r1 * LIGHT_YRS);
        // console.log('phi (rad, degrees)', phi, phi * 180 / Math.PI);


        // calculate how far off to the side the observed light would have landed
        let alpha = Math.atan2(offset - r2, sourceDist - clusterDist);
        // console.log(alpha, alpha * 180 / Math.PI);

        let y1 = offset - sourceDist * Math.tan(theta1 - phi);
        let y2 = offset - sourceDist * Math.sin(alpha);
        // console.log('original ray offset', y1, y2);


        this.leftPathEarth.clear();
        this.rightPathEarth.clear();
        this.leftPathLight.clear();
        this.rightPathLight.clear();

        this.leftPathEarth.lineStyle(2, 0xa1a0da);
        this.rightPathEarth.lineStyle(2, 0xa1a0da);
        
        // scaling factor of 0.0003
        this.leftPathEarth.moveTo(this.sourceGalaxy.x, this.sourceGalaxy.y);
        this.leftPathEarth.lineTo(this.earth.x - r1/10000, this.midCluster.y);
        this.leftPathEarth.moveTo(this.earth.x - r1/10000, this.midCluster.y);
        this.leftPathEarth.lineTo(this.earth.x, this.earth.y);

        this.rightPathEarth.moveTo(this.sourceGalaxy.x, this.sourceGalaxy.y);
        this.rightPathEarth.lineTo(this.earth.x - r2/10000, this.midCluster.y);
        this.rightPathEarth.moveTo(this.earth.x - r2/10000, this.midCluster.y);
        this.rightPathEarth.lineTo(this.earth.x, this.earth.y);

        if (this.props.params.showOriginalPath) {
            this.leftPathLight.lineStyle(2, 0xba341e);
            this.rightPathLight.lineStyle(2, 0xba341e);

            this.leftPathLight.moveTo(this.earth.x - r1/10000, this.midCluster.y);
            this.leftPathLight.lineTo(this.earth.x - y1 / 10000, this.earth.y);
            
            this.rightPathLight.moveTo(this.earth.x - r2/10000, this.midCluster.y);
            this.rightPathLight.lineTo(this.earth.x - y2 / 10000, this.earth.y);
        }

        this.props.onBetaUpdate(beta);
        this.props.onTheta1Update(theta1 * ARCSEC_PER_RADIAN);
        this.props.onTheta2Update(theta2 * ARCSEC_PER_RADIAN);
        this.props.onR1Update(r1);
        this.props.onR2Update(r2);
        this.props.onY1Update(y1);
        this.props.onY2Update(y2);
    }

    updateGalaxies() {
        // scaling factor of 0.03
        // source
        this.sourceGalaxy.x = this.earth.x - this.props.params.sourceOffset / 10;
        this.sourceGalaxy.y = 400 - this.props.params.sourceDist * 30;
        // earth view
        // this.viewGalaxy.x = this.earth.x + this.props.params.sourceOffset / 10;

        this.viewGalaxy.x = this.earth.x - this.props.params.beta * 3;
        this.leftGalaxy.x = this.earth.x - this.props.params.theta1 * 3;
        this.rightGalaxy.x = this.earth.x - this.props.params.theta2 * 3;
    }

    updateMidLine() {
        this.midLine.clear(); 

        if (this.props.params.showDirectPath) {
            this.midLine.lineStyle(1, 0xFFFFFF);
            this.midLine.moveTo(this.sourceGalaxy.x, this.sourceGalaxy.y);
            this.midLine.lineTo(this.earth.x, this.earth.y);
        }
    }

    updateLabels() {
        this.galaxyText.x = this.sourceGalaxy.x + 115;
        this.galaxyText.y = this.sourceGalaxy.y;

        this.galaxyLine.clear();
        this.galaxyLine.lineStyle(2, 0xFFFFFF);

        this.galaxyLine.moveTo(this.sourceGalaxy.x + 25, this.sourceGalaxy.y);
        this.galaxyLine.lineTo(this.sourceGalaxy.x + 75, this.sourceGalaxy.y);
    }

    updateArcs() {
        this.rightArc.clear();
        this.leftArc.clear();
        this.rightArcArrow.clear();
        this.leftArcArrow.clear();
        
        if (this.props.params.showLightAngle) {
            this.rightArc.lineStyle(2, 0xe8c3c3);
            this.leftArc.lineStyle(2, 0xe8c3c3);
            this.rightArcArrow.lineStyle(2, 0xe8c3c3);
            this.leftArcArrow.lineStyle(2, 0xe8c3c3);

            let rightArcAngleStart = Math.atan2(this.midCluster.y - this.earth.y, (this.earth.x - this.props.params.r2 / 10000) - this.earth.x);
            let rightArcAngleEnd = Math.atan2(this.sourceGalaxy.y - this.earth.y, this.sourceGalaxy.x - this.earth.x);
            let leftArcAngleStart = Math.atan2(this.midCluster.y - this.earth.y, (this.earth.x - this.props.params.r1 / 10000) - this.earth.x);
            let leftArcAngleEnd = Math.atan2(this.sourceGalaxy.y - this.earth.y, this.sourceGalaxy.x - this.earth.x);

            this.rightArc.arc(
                this.earth.x,
                this.earth.y,
                30,
                rightArcAngleStart, 
                rightArcAngleEnd, 
                true
            );
            this.leftArc.arc(
                this.earth.x,
                this.earth.y,
                24,
                leftArcAngleStart, 
                leftArcAngleEnd, 
                false
            );

            // finished drawing actual arc, move onto arrowheads
            let rightArcArrowTip = convertPolarToRect(30, rightArcAngleStart, this.earth);
            let leftArcArrowTip = convertPolarToRect(24, leftArcAngleStart, this.earth);

            // for arrow tips
            let rightTip = Math.atan2((this.midCluster.y - 10 * this.props.params.clusterDist) - this.earth.y, (this.earth.x - this.props.params.r2 / 10000 - 10 * this.props.params.clusterDist) - this.earth.x);
            let leftTip = Math.atan2((this.midCluster.y - 10 * this.props.params.clusterDist) - this.earth.y, (this.earth.x - this.props.params.r1 / 10000 + 10 * this.props.params.clusterDist) - this.earth.x);
            let a = convertPolarToRect(34, rightTip, this.earth);  // r + 4
            let b = convertPolarToRect(26, rightTip, this.earth);  // r - 4
            let c = convertPolarToRect(28, leftTip, this.earth);   // r + 4
            let d = convertPolarToRect(20, leftTip, this.earth);   // r - 4

            this.rightArcArrow.moveTo(rightArcArrowTip.x, rightArcArrowTip.y);
            this.rightArcArrow.lineTo(a.x, a.y);
            this.rightArcArrow.moveTo(rightArcArrowTip.x, rightArcArrowTip.y);
            this.rightArcArrow.lineTo(b.x, b.y);

            this.leftArcArrow.moveTo(leftArcArrowTip.x, leftArcArrowTip.y);
            this.leftArcArrow.lineTo(c.x, c.y);
            this.leftArcArrow.moveTo(leftArcArrowTip.x, leftArcArrowTip.y);
            this.leftArcArrow.lineTo(d.x, d.y);
        }
    }

    updateViewPort() {
        this.betaLine.clear();
        this.rightLine.clear();
        this.leftLine.clear();

        this.betaArrow.clear();
        this.rightArrow.clear();
        this.leftArrow.clear();

        this.betaLine.lineStyle(2, 0xe9c452);
        this.betaLine.moveTo(this.botCluster.x, 465);
        this.betaLine.lineTo(this.viewGalaxy.x, 465);
        

        this.betaArrow.lineStyle(2, 0xe9c452);
        this.betaArrow.moveTo(this.viewGalaxy.x, 465);
        if (this.props.params.beta > 0) {   // left 
            this.betaArrow.lineTo(this.viewGalaxy.x + 5, 460);
            this.betaArrow.moveTo(this.viewGalaxy.x, 465);
            this.betaArrow.lineTo(this.viewGalaxy.x + 5, 470);
        } 
        if (this.props.params.beta < 0) {   // right
            this.betaArrow.lineTo(this.viewGalaxy.x - 5, 460);
            this.betaArrow.moveTo(this.viewGalaxy.x, 465);
            this.betaArrow.lineTo(this.viewGalaxy.x - 5, 470);
        }

        this.betaText.text = Number.parseFloat(this.props.params.beta).toFixed(1) + " arcseconds";

        if (this.props.params.showCluster && this.props.params.showLightAngle) {
            this.rightLine.lineStyle(2, 0xa1a0da);
            this.leftLine.lineStyle(2, 0xa1a0da);
            this.rightArrow.lineStyle(2, 0xa1a0da);
            this.leftArrow.lineStyle(2, 0xa1a0da);

            this.rightLine.moveTo(this.botCluster.x, 525);
            this.rightLine.lineTo(this.rightGalaxy.x, 525);
            this.leftLine.moveTo(this.botCluster.x, 525);
            this.leftLine.lineTo(this.leftGalaxy.x, 525);

            this.rightArrow.moveTo(this.rightGalaxy.x, 525);
            this.rightArrow.lineTo(this.rightGalaxy.x - 5, 520);
            this.rightArrow.moveTo(this.rightGalaxy.x, 525);
            this.rightArrow.lineTo(this.rightGalaxy.x - 5, 530);

            this.leftArrow.moveTo(this.leftGalaxy.x, 525);
            this.leftArrow.lineTo(this.leftGalaxy.x + 5, 520);
            this.leftArrow.moveTo(this.leftGalaxy.x, 525);
            this.leftArrow.lineTo(this.leftGalaxy.x + 5, 530);

            this.leftText.text = Number.parseFloat(this.props.params.theta1).toFixed(1) + " arcseconds";
            this.rightText.text = Number.parseFloat(this.props.params.theta2).toFixed(1) + " arcseconds";
        }
    
    }
}


MainView.propTypes = {
    params: PropTypes.exact({
        clusterMass: PropTypes.number.isRequired,
        clusterDist: PropTypes.number.isRequired,
        sourceDist: PropTypes.number.isRequired,
        sourceOffset: PropTypes.number.isRequired,
        showCluster: PropTypes.bool.isRequired,
        showDirectPath: PropTypes.bool.isRequired,
        showOriginalPath: PropTypes.bool.isRequired,
        showLightAngle: PropTypes.bool.isRequired,
        beta: PropTypes.number.isRequired,
        theta1: PropTypes.number.isRequired,
        theta2: PropTypes.number.isRequired,
        r1: PropTypes.number.isRequired,
        r2: PropTypes.number.isRequired,
        y1: PropTypes.number.isRequired,
        y2: PropTypes.number.isRequired
    }).isRequired,
    onBetaUpdate: PropTypes.func.isRequired,
    onY1Update: PropTypes.func.isRequired,
    onY2Update: PropTypes.func.isRequired,
    onTheta1Update: PropTypes.func.isRequired,
    onTheta2Update: PropTypes.func.isRequired,
    onR1Update: PropTypes.func.isRequired,
    onR2Update: PropTypes.func.isRequired
};
