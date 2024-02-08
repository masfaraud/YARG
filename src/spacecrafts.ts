import {Mesh, MeshBuilder, Scene, Texture, ShadowDepthWrapper, Vector3, ParticleSystem, Color3, Color4, Sound, TransformNode, StandardMaterial} from "@babylonjs/core";
import {FireMaterial} from "@babylonjs/materials/fire"

export class Component{

}

// const SCALE = 0.001;

export class SpaceCraft{
    root: TransformNode;
    stage: Mesh;
    nozzle: Mesh;
    fairing: Mesh;
    speed: Vector3;
    fuel_capacity: number;
    throttle: number;
    engine_sound: Sound;
    smoke: ParticleSystem;

    fire_plane: Mesh;
    // components: Component[]

    constructor(private scene:Scene) {
        this.root = new TransformNode('Spacecraft', scene, true);
        // this.root = new Entity('Spacecraft', scene);

        this.speed = new Vector3(0., 0., 0.)
        this.fuel_capacity = 10000.

        var white_paint = new StandardMaterial("white_paint", scene);
        white_paint.diffuseColor = new Color3(0.95, 0.98, 0.95);
        
        var black_paint = new StandardMaterial("black_paint", scene);
        black_paint.diffuseColor = new Color3(0.05, 0.03, 0.05);

        this.stage = MeshBuilder.CreateCylinder("rocket", { diameter: 2. , height: 20.}, scene);
        this.stage.material = white_paint;
        this.stage.parent = this.root


        this.fairing = MeshBuilder.CreateCylinder("fairing", { diameterTop: 0.1, diameterBottom:2., height:4.}, scene);
        this.fairing.position = new Vector3(0., 12., 0.);
        this.fairing.material = white_paint;
        this.fairing.parent = this.root
        
        this.nozzle = MeshBuilder.CreateCylinder("nozzle", { diameterTop: 1.7 , diameterBottom:2.8, height:2.}, scene);
        this.nozzle.position = new Vector3(0., -11., 0.);
        this.nozzle.material = black_paint;
        this.nozzle.parent = this.root
        
        

        // Set flame

        // Create fire material
        var fire = new FireMaterial("fire", scene);
        fire.diffuseTexture = new Texture("textures/fire.png", scene);
        fire.distortionTexture = new Texture("textures/distortion.png", scene);
        fire.opacityTexture = new Texture("textures/candleopacity.png", scene);
        fire.speed = 15.0;

        this.fire_plane = MeshBuilder.CreatePlane("fireplane", {size: 1.}, scene);
        this.fire_plane.parent = this.nozzle;
		this.fire_plane.position.y -= 5;
        this.fire_plane.scaling.x = 1.5;
        this.fire_plane.scaling.y = 0.;
		this.fire_plane.billboardMode = Mesh.BILLBOARDMODE_Y;
		this.fire_plane.material = fire;
        this.fire_plane.material.shadowDepthWrapper = new ShadowDepthWrapper(this.fire_plane.material);


        // Smoke
        // Create a particle system
        var smoke = new ParticleSystem("particles", 8000, scene);

        //Texture of each particle
        smoke.particleTexture = new Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/FFV/smokeParticleTexture.png", scene);

        smoke.emitter = this.nozzle;

        // lifetime
        smoke.minLifeTime = 2;
        smoke.maxLifeTime = 30;

        // emit rate
        smoke.emitRate = 0.;

        // gravity
        // smoke.gravity = new Vector3(0.,0, 0);

        // size gradient
        smoke.addSizeGradient(0, 0.6, 1);
        smoke.addSizeGradient(0.3, 1, 2);
        smoke.addSizeGradient(0.5, 2, 3);
        smoke.addSizeGradient(1.0, 6, 8);

        // color gradient
        smoke.addColorGradient(0, new Color4(0.5, 0.5, 0.5, 0),  new Color4(0.8, 0.8, 0.8, 0));
        smoke.addColorGradient(0.4, new Color4(0.1, 0.1, 0.1, 0.1), new Color4(0.4, 0.4, 0.4, 0.4));
        smoke.addColorGradient(0.7, new Color4(0.03, 0.03, 0.03, 0.2), new Color4(0.3, 0.3, 0.3, 0.4));
        smoke.addColorGradient(1.0, new Color4(0.0, 0.0, 0.0, 0), new Color4(0.03, 0.03, 0.03, 0));

        // speed gradient
        smoke.addVelocityGradient(0, 1, 1.5);
        smoke.addVelocityGradient(0.1, 0.8, 0.9);
        smoke.addVelocityGradient(0.7, 0.4, 0.5);
        smoke.addVelocityGradient(1, 0.1, 0.2);

        // rotation
        smoke.minInitialRotation = 0;
        smoke.maxInitialRotation = Math.PI;
        smoke.minAngularSpeed = -1;
        smoke.maxAngularSpeed = 1;

        // blendmode
        smoke.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        
        // emitter shape
        var sphereEmitter = smoke.createSphereEmitter(0.1);

        // Where the particles come from
        smoke.emitter = this.nozzle;
        smoke.minEmitBox = new Vector3(-0.5, -10, -0.5); // Starting all from
        smoke.maxEmitBox = new Vector3(0.5, 10, 0.5); // To...

        // Start the particle system
        smoke.start();

        this.smoke = smoke;

        // Engine sound

        this.engine_sound = new Sound("engine_noise", "sounds/engine.wav", scene, null, {
            loop: true,
            autoplay: true,
            spatialSound: true,
            distanceModel: "linear",
            // rolloffFactor: 2,
            maxDistance: 5000.,
            volume:0.
          });

        this.engine_sound.attachToMesh(this.nozzle);


        this.update_throttle(0.)

    }

    mass(){
        return 10000. + this.fuel_capacity;
    }

    update_throttle(throttle: number){
        this.throttle = throttle;

        this.fire_plane.scaling.y = -15.*throttle;
        this.fire_plane.position.y = -6.*throttle + 1.;

        this.smoke.emitRate = 5000. * this.throttle;

        if (this.throttle === 0.){
            this.engine_sound.setVolume(0.)
        }
        else{
            this.engine_sound.setVolume(0.5+3.5*this.throttle);
        }

    }

    shake_amplitude(){
        return this.throttle * 0.002;
    }

    engine_force(){
        return this.throttle * 98900.;
    }

    consume_fuel(delta_time: number){
        this.fuel_capacity -= delta_time*this.fuel_flow()
    }

    fuel_flow(){
        return this.throttle * 50.
    }

    get_forces(){

        // Gravity
        var forces = new Vector3(0., -this.mass()*0.5, 0.)

        // // stages 
        // for (let component of this.components){
        // }

        // Engine, for now
        forces = forces.add(new Vector3(0., this.engine_force(), 0.))

        return forces;
    }
}