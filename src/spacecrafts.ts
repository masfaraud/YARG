import {Mesh, MeshBuilder, Scene, Texture, ShadowDepthWrapper, Vector3, ParticleSystem, Color3, Color4, Sound, TransformNode, StandardMaterial} from "@babylonjs/core";
import {FireMaterial} from "@babylonjs/materials/fire"

export class Component{

}

export class SpaceCraft{
    root: TransformNode;
    stage: Mesh;
    nozzle: Mesh;
    fairing: Mesh;
    speed: Vector3;
    fuel_capacity: number;
    throttle: number;
    // components: Component[]

    constructor(private scene:Scene) {
        this.root = new TransformNode('Spacecraft', scene);

        this.speed = new Vector3(0., 0., 0.)
        this.fuel_capacity = 10000.
        this.throttle = 0.

        var white_paint = new StandardMaterial("white_paint", scene);
        white_paint.diffuseColor = new Color3(0.95, 0.98, 0.95);
        
        var black_paint = new StandardMaterial("black_paint", scene);
        black_paint.diffuseColor = new Color3(0.05, 0.03, 0.05);

        this.stage = MeshBuilder.CreateCylinder("rocket", { diameter: 2 , height:20}, scene);
        this.stage.material = white_paint;
        this.stage.parent = this.root


        this.fairing = MeshBuilder.CreateCylinder("fairing", { diameterTop: 0.1, diameterBottom:2, height:4}, scene);
        this.fairing.position = new Vector3(0, 12, 0);
        this.fairing.material = white_paint;
        this.fairing.parent = this.root
        
        this.nozzle = MeshBuilder.CreateCylinder("nozzle", { diameterTop: 1.7 , diameterBottom:2.8, height:2}, scene);
        this.nozzle.position = new Vector3(0, -11, 0);
        this.nozzle.material = black_paint;
        this.nozzle.parent = this.root
        
        

        // Set flame

        // Create fire material
        var fire = new FireMaterial("fire", scene);
        fire.diffuseTexture = new Texture("textures/fire.png", scene);
        fire.distortionTexture = new Texture("textures/distortion.png", scene);
        fire.opacityTexture = new Texture("textures/candleopacity.png", scene);
        fire.speed = 5.0;

        var plane = MeshBuilder.CreatePlane("fireplane", {size: 1.5}, scene);
        plane.parent = this.nozzle;
		plane.position.y -= 5;
        plane.scaling.x = 1.5;
        plane.scaling.y = -10;
		plane.billboardMode = Mesh.BILLBOARDMODE_Y;
		plane.material = fire;
        plane.material.shadowDepthWrapper = new ShadowDepthWrapper(plane.material);


        // Smoke
        // Create a particle system
        var particleSystem = new ParticleSystem("particles", 8000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new Texture("https://raw.githubusercontent.com/PatrickRyanMS/BabylonJStextures/master/FFV/smokeParticleTexture.png", scene);

        particleSystem.emitter = this.nozzle;

        // lifetime
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 10;

        // emit rate
        particleSystem.emitRate = 1000;

        // gravity
        particleSystem.gravity = new Vector3(0., -60, 0);

        // size gradient
        particleSystem.addSizeGradient(0, 0.6, 1);
        particleSystem.addSizeGradient(0.3, 1, 2);
        particleSystem.addSizeGradient(0.5, 2, 3);
        particleSystem.addSizeGradient(1.0, 6, 8);

        // color gradient
        particleSystem.addColorGradient(0, new Color4(0.5, 0.5, 0.5, 0),  new Color4(0.8, 0.8, 0.8, 0));
        particleSystem.addColorGradient(0.4, new Color4(0.1, 0.1, 0.1, 0.1), new Color4(0.4, 0.4, 0.4, 0.4));
        particleSystem.addColorGradient(0.7, new Color4(0.03, 0.03, 0.03, 0.2), new Color4(0.3, 0.3, 0.3, 0.4));
        particleSystem.addColorGradient(1.0, new Color4(0.0, 0.0, 0.0, 0), new Color4(0.03, 0.03, 0.03, 0));

        // speed gradient
        particleSystem.addVelocityGradient(0, 1, 1.5);
        particleSystem.addVelocityGradient(0.1, 0.8, 0.9);
        particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
        particleSystem.addVelocityGradient(1, 0.1, 0.2);

        // rotation
        particleSystem.minInitialRotation = 0;
        particleSystem.maxInitialRotation = Math.PI;
        particleSystem.minAngularSpeed = -1;
        particleSystem.maxAngularSpeed = 1;

        // blendmode
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        
        // emitter shape
        var sphereEmitter = particleSystem.createSphereEmitter(0.1);

        // Where the particles come from
        particleSystem.emitter = new Vector3(0, 0, 0); // the starting object, the emitter
        particleSystem.minEmitBox = new Vector3(-0.5, -10, -0.5); // Starting all from
        particleSystem.maxEmitBox = new Vector3(0.5, 10, 0.5); // To...

        // Start the particle system
        particleSystem.start();

        // Engine sound

        const music = new Sound("engine_noise", "sounds/engine.wav", scene, null, {
            loop: true,
            autoplay: true,
            spatialSound: true,
            distanceModel: "linear",
            // rolloffFactor: 2,
            maxDistance: 5000,
            volume:3
          });

          music.attachToMesh(this.nozzle);

    }

    mass(){
        return 10000 + this.fuel_capacity;
    }

    engine_force(){
        return 98500;
    }

    consume_fuel(delta_time: number){
        this.fuel_capacity -= delta_time*this.fuel_consumtion()
    }

    fuel_consumtion(){
        return this.throttle * 50.
    }

    get_forces(){

        // Gravity
        var forces = new Vector3(0, -this.mass()*9.81, 0)

        // // stages 
        // for (let component of this.components){
        // }

        // Engine, for now
        forces = forces.add(new Vector3(0., this.engine_force(), 0.))

        return forces;
    }
}