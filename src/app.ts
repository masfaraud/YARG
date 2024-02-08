import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, Color4, HemisphericLight, Mesh, MeshBuilder, KeyboardEventTypes} from "@babylonjs/core";
// import { Control, Slider, AdvancedDynamicTexture, TextBlock, Button, StackPanel} from '@babylonjs/gui/2D';

import {Earth} from "./planets"
import {SpaceCraft} from "./spacecrafts"
import {GUI} from "./gui"
import { Simulator } from "./simulator";


class App {
    scene: Scene;
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = <HTMLCanvasElement> document.getElementById("renderCanvas")

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);

        this.scene = new Scene(engine);

        this.scene .clearColor = new Color4(0.01, 0.01, 0.01, 0.01);
        this.scene .useRightHandedSystem = true;

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene );
        var earth: Earth = new Earth(this.scene);
        
    
        var planet_camera: ArcRotateCamera = new ArcRotateCamera("Planet", Math.PI / 2, Math.PI / 2, 2*earth.radius, Vector3.Zero(), this.scene );
        planet_camera.maxZ = 1000.*earth.radius;
        planet_camera.wheelDeltaPercentage = 0.01;

        planet_camera.target.y -= earth.radius;
        // spacecraft_camera.attachControl(canvas, true);

        var spacecraft = new SpaceCraft(this.scene );
        spacecraft.root.position.y = earth.radius;

        var spacecraft_camera: ArcRotateCamera = new ArcRotateCamera("Spacecraft", Math.PI / 2, Math.PI / 2, 50., Vector3.Zero(), this.scene );
        spacecraft_camera.maxZ = 1000.*earth.radius;
        spacecraft_camera.parent = spacecraft.root;
        spacecraft_camera.attachControl(canvas, true);
        this.scene.activeCamera = spacecraft_camera;

        var gui = new GUI(this.scene, spacecraft);
        let simulator = new Simulator(spacecraft, spacecraft_camera, gui);



        this.scene.registerBeforeRender(() => {simulator.simulation_callback()})


        this.scene.onKeyboardObservable.add((kbenvent) => {
            gui.updateDownKeys(kbenvent.event);
        });

        window.addEventListener("keydown", (ev) => {
          
            
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });


        // run the main render loop
        engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}
var app = new App();
