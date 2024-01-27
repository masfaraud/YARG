import {SpaceCraft} from './spacecrafts'

export class Simulator{
    spacecraft: SpaceCraft;
    last_computation: any;
    
    constructor(spacecraft: SpaceCraft){
        this.spacecraft = spacecraft;
        this.last_computation = new Date().getTime()
        
    }

    simulation_callback(this: Simulator){
        var now = new Date().getTime();
        let delta_time =  (now - this.last_computation) / 1000.

        var forces = this.spacecraft.get_forces();
        
        var inv_mass = 1/this.spacecraft.mass()
        this.spacecraft.speed = this.spacecraft.speed.add(forces.multiplyByFloats(inv_mass, inv_mass, inv_mass))

        this.spacecraft.root.position = this.spacecraft.root.position.add(this.spacecraft.speed.multiplyByFloats(delta_time, delta_time, delta_time));

        this.last_computation = now;

    }
}