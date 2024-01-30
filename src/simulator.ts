import { ArcRotateCamera, Vector3 } from '@babylonjs/core';
import {SpaceCraft} from './spacecrafts'
import { GUI } from './gui';

export class Simulator{
    spacecraft: SpaceCraft;
    spacecraft_camera: ArcRotateCamera;
    last_computation: number;
    gui: GUI;
    
    constructor(spacecraft: SpaceCraft, spacecraft_camera: ArcRotateCamera, gui:GUI){
        this.spacecraft = spacecraft;
        this.spacecraft_camera = spacecraft_camera;
        this.gui = gui;

        this.last_computation = new Date().getTime()
        
    }

    simulation_callback(this: Simulator){
        var now = new Date().getTime();
        let delta_time =  (now - this.last_computation) / 1000.

        // Speed & position update
        var forces = this.spacecraft.get_forces();
        var inv_mass = 1/this.spacecraft.mass()
        this.spacecraft.speed = this.spacecraft.speed.add(forces.multiplyByFloats(inv_mass, inv_mass, inv_mass))
        this.spacecraft.root.position = this.spacecraft.root.position.add(this.spacecraft.speed.multiplyByFloats(delta_time, delta_time, delta_time));

        // Temp solution of avoiding goeing below ground:
        if (this.spacecraft.root.position.y < 0){
            this.spacecraft.root.position.y = 0;
            this.spacecraft.speed = new Vector3(0, 0, 0);
        }

        // Camera shake
        var shake_amplitude = this.spacecraft.shake_amplitude()
        var delta_alpha = Math.cos(now)*shake_amplitude;
        var delta_beta = Math.sin(now)*shake_amplitude;
        this.spacecraft_camera.alpha += delta_alpha
        this.spacecraft_camera.beta += delta_beta

        this.last_computation = now;

        // GUI update
        this.gui.update();

    }
}