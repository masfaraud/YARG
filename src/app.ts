import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";


import {Earth} from "./planets"
import {SpaceCraft} from "./spacecrafts"
import {GUI} from "./gui"
import { Simulator } from "./simulator";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = <HTMLCanvasElement> document.getElementById("renderCanvas")

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        scene.useRightHandedSystem = true;

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 50, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var earth: Earth = new Earth(scene);

        var spacecraft = new SpaceCraft(scene);
        camera.parent = spacecraft.root;

        let simulator = new Simulator(spacecraft)

        scene.registerBeforeRender(() => {simulator.simulation_callback()})

        var gui = new GUI(scene);

        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
}
new App();
