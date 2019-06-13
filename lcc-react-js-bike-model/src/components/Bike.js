import React, { Component } from 'react';
import { TweenMax, Power2 } from 'gsap';
import LCC from 'lightning-container';
import {
    Scene,
    Engine,
    AssetsManager,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    Color3,
    Tools,
    MeshBuilder,
    Texture,
    StandardMaterial,
    Axis
} from 'babylonjs';

class Bike extends Component {
    /**
     * Colors to use when coloring different parts of the bike
     */
    colors = {
        red: new Color3(0.5137, 0, 0),
        blue: new Color3(0, 0, 0.5137),
        green: new Color3(0, 0.5137, 0),
        yellow: new Color3(0.5137, 0.5137, 0),
        black: new Color3(0, 0, 0),
        white: new Color3(1, 1, 1),
        grey: new Color3(0.5, 0.5, 0.5)
    };

    /**
     * Hash Table of our regions of bike parts in the model
     * Contains the coordinates to move camera to view the respective bike part
     */
    regions = {
        frame: {
            id: 'Cadru1',
            alpha: 6.283185307179586,
            beta: 1.5707963267948966,
            radius: 10.038390861264055
        },
        seat: {
            id: 'Sa',
            alpha: 8.460744722271127,
            beta: 0.7251213529780364,
            radius: 10.038313487331575
        },
        waterbottle: {
            id: 'BidonRosu',
            alpha: 5.549944373409927,
            beta: 1.7457505434456517,
            radius: 9.999805933906167
        },
        handlebars: {
            id: 'Ghidon',
            alpha: 5.218007193438249,
            beta: 1.042441018904849,
            radius: 19.999952560667452
        }
    };

    constructor(props) {
        super(props);

        // Bind our events to keep the proper "this" context.
        this.moveCamera = this.moveCamera.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    /**
     * Animates the movement of the camera to new requested region to view
     * e -> {detail: 'frame|seat|waterbottle|handlebars'}
     */
    moveCamera = e => {
        TweenMax.to(this.camera, 1, {
            radius: this.regions[e.detail].radius,
            alpha: this.regions[e.detail].alpha,
            beta: this.regions[e.detail].beta,
            ease: Power2.easeOut
        });
    };

    /**
     * Change color of whatever part is requested
     *
     * e -> {detail: {meshName: 'frame|seat|waterbottle|handlebars', color: 'white|red|green|blue|grey|black|yellow'}}
     */
    changeColor = e => {
        let mesh = this.scene.getMeshByID(this.regions[e.detail.meshName].id);
        mesh.material = mesh.material.clone();
        TweenMax.to(mesh.material.diffuseColor, 1, {
            r: this.colors[e.detail.color].r,
            g: this.colors[e.detail.color].g,
            b: this.colors[e.detail.color].b
        });
    };

    /**
     * Makes the canvas behave responsively
     */
    onResizeWindow = () => {
        if (this.engine) {
            this.engine.resize();
        }
    };

    /**
     * Sets up our canvas tag for webGL scene
     */
    setEngine = () => {
        this.stage.style.width = '200%';
        this.stage.style.height = '200%';
        this.engine = new Engine(this.stage);
        this.stage.style.width = '100%';
        this.stage.style.height = '100%';
    };

    /**
     * Creates the scene graph
     */

    setScene = () => {
        this.scene = new Scene(this.engine);

        // By default scenes have a blue background -> set a cool gray color
        this.scene.clearColor = new Color3(0.9, 0.9, 0.92);
    };

    /**
     * Adds camera to our scene
     * A scene needs a camera for anything to be visible
     * Also sets up rotation Controls
     */
    setCamera = () => {
        this.camera = new ArcRotateCamera(
            'Camera',
            Math.PI * 2,
            Tools.ToRadians(80),
            20,
            new Vector3(0, 5, -5),
            this.scene
        );
        this.camera.attachControl(this.stage, true);
        this.camera.lowerRadiusLimit = 9;
        this.camera.upperRadiusLimit = 20;
        this.camera.lowerBetaLimit = this.camera.beta - Tools.ToRadians(80);
        this.camera.upperBetaLimit = this.camera.beta + Tools.ToRadians(20);
        this.camera.lowerAlphaLimit = this.camera.alpha - Tools.ToRadians(180);
        this.camera.upperAlphaLimit = this.camera.alpha + Tools.ToRadians(180);
    };

    /**
     * Load the 3D model of the bike which is stored in an AWS S3 server
     */
    loadModels = () => {
        // AssetManager class is responsible for loading files
        let loader = new AssetsManager(this.scene);
        let loadBikeModel = loader.addMeshTask(
            'bike',
            '',
            'https://s3-us-west-1.amazonaws.com/e-bikes/',
            'bike.babylon'
        );

        // Loader is given a callback to run when the model has loaded
        loadBikeModel.onSuccess = t => {
            this.scene.getMeshByID('Sa').material = this.scene
                .getMeshByID('Sa')
                .material.clone();
            this.scene.getMeshByID('Ghidon').material = this.scene
                .getMeshByID('Ghidon')
                .material.clone();
            this.scene.getMeshByID(
                'BidonRosu'
            ).material = this.scene.getMeshByID('BidonRosu').material.clone();
            this.scene.getMeshByID('Furca').material = this.scene
                .getMeshByID('Furca')
                .material.clone();
            this.scene.getMeshByID(
                'Cadru1'
            ).material.diffuseColor = this.scene
                .getMeshByID('Cadru1')
                .material.clone();

            this.scene.getMeshByID('Sa').material.diffuseColor = this.colors[
                'grey'
            ];
            this.scene.getMeshByID(
                'Ghidon'
            ).material.diffuseColor = this.colors['grey'];
            this.scene.getMeshByID(
                'BidonRosu'
            ).material.diffuseColor = this.colors['grey'];
            this.scene.getMeshByID('Furca').material.diffuseColor = this.colors[
                'black'
            ];
            this.scene.getMeshByID(
                'Cadru1'
            ).material.diffuseColor = this.colors['white'];

            // Start the animation loop once the model is loaded
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });

            // The model came in a little dark, so lets add some extra light
            new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
        };

        // Add error callback if something goes wrong
        loadBikeModel.onError = (task, message, exception) => {
            console.log(message, exception);
        };

        // Return the fully configured loader
        return loader;
    };

    /**
     * Load the E-bikes logo below the 3D bike
     */
    loadLogo() {
        // Get the bike logo into a babylon object
        let url = 'ebikeslogo.png';
        var materialPlane = new StandardMaterial('logo', this.scene);
        materialPlane.diffuseTexture = new Texture(url, this.scene);
        materialPlane.diffuseTexture.hasAlpha = true;
        materialPlane.specularColor = new Color3(0, 0, 0);

        // Create a plane and paste the e-bikes logo in it
        let logo = MeshBuilder.CreatePlane(
            'logo',
            { width: 470 / 20, height: 440 / 20 },
            this.scene,
            true
        );
        logo.position = new Vector3(0, 0, -5);
        logo.rotate(Axis.X, Math.PI / 2);
        logo.material = materialPlane;
    }

    /**
     * Add message handler to communicate with parent Aura component, LCC
     * For each type of message, call the appropriate function
     */
    attachLCCMessageHandler() {
        LCC.addMessageHandler(({ name, value }) => {
            switch (name) {
                case 'move-camera':
                    this.moveCamera(value);
                    break;
                case 'change-color':
                    this.changeColor(value);
                    break;
            }
        });
    }

    /**
     * Build the scene when the component has been loaded.
     */
    componentDidMount() {
        this.setEngine();
        this.setScene();
        this.setCamera();
        this.loadLogo();

        // Loader we return has a load method attached that will initiate everything
        this.loadModels().load();

        // Attach handlers for communication with lightning parent component, LCC
        this.attachLCCMessageHandler();

        // For resize events, perform a resize
        window.addEventListener('resize', this.onResizeWindow);
    }

    /**
     * Renderes our Canvas tag and saves a reference to it
     */

    render() {
        return <canvas className="scene" ref={el => (this.stage = el)} />;
    }
}

// Returns the 3D model of Bike to be used by other components
export default Bike;
