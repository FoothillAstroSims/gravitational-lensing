import React from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

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
            .add('virtualGalaxy', 'img/purple-spiral.png');

        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;
            me.earth = me.drawEarth(resources.earth);
            me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, 275, 50);
            me.realGalaxyContainer = me.drawRealGalaxy(resources.realGalaxy, 275, 480);
            // me.virtualGalaxyContainer = me.drawVirtualGalaxy(resources.virtualGalaxy, 200, 50);
            me.rectangle = me.drawRectangle();
            me.description = me.drawLabel('View from Earth', 275, 525);
            me.galaxyText = me.drawLabel('Distant galaxy', 150, 150);
            me.earthText = me.drawLabel('Earth', 150, 300);
            me.midLine = me.drawLine(275, 90, 275, 360);
            me.galaxyLine = me.drawLine(180, 120, 250, 75);
            me.earthLine = me.drawLine(180, 330, 250, 375);
            // me.start();
        });
    }

    componentWillUnmount(prevProps, prevState) {
        this.app.stop();
    }

    render() {
        return (
            <React.Fragment>
                <div className="MainViewWrapper">
                    <div 
                        className="MainView" 
                        ref={(thisDiv) => { this.pixiElement = thisDiv; }} 
                    />
                </div>
            </React.Fragment>
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

    // You don't need an animate function. In fact, componentDidUpdate()
    // is much better since it's controlled by React (and probably more efficient)
    // componentDidUpdate() essentially runs every time the parent (in this case, main.jsx) has its state variables
    // changed. Since you passed in the settings, it will run every time settings gets changed
    componentDidUpdate() {
        this.updateLine();
        this.updateText();
    }

    updateLine() {
        /**
         * This is what you had before.
         */
        // if (this.props.settings.showCluster) {
        //     this.line.clear();
        // } else {
        //     this.drawLine();
        // }

        // This works for anything :)
        this.midLine.visible = !this.props.settings.showCluster;
        this.galaxyLine.visible = !this.props.settings.showCluster;
        this.earthLine.visible = !this.props.settings.showCluster;
    }

    updateText() {
        this.galaxyText.visible = !this.props.settings.showCluster;
        this.earthText.visible = !this.props.settings.showCluster;
    }
}

