import {Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Color3, Vector3} from "@babylonjs/core";
import {SkyMaterial} from "@babylonjs/materials"


export class Earth{
    mesh: Mesh;
    radius: number;

    constructor(private scene:Scene) {
        this.radius = 6371000.;
        this.mesh = MeshBuilder.CreateSphere("earth", { diameter: 2*this.radius}, scene);

        this.mesh.position.y = -this.radius;

        var earthMaterial = new StandardMaterial("earthMaterial", scene);
        var earth_diffuse_texture = new Texture("textures/earth.jpeg", scene);
        earthMaterial.diffuseTexture = earth_diffuse_texture
        earthMaterial.backFaceCulling = true;
        this.mesh.material = earthMaterial;
        this.mesh.rotate(new Vector3(1., 0., 0.), 44.4 * Math.PI / 180.);
        this.mesh.rotate(new Vector3(0., 1., 0.), -96.0 * Math.PI / 180.);

        // Ground
        var ground = MeshBuilder.CreateGroundFromHeightMap("ground", "textures/heightmap2.png", {width: 47350., height: 47350., subdivisions: 500, minHeight:100., maxHeight: 3000.}, scene);
        var groundMaterial = new StandardMaterial("ground", scene);
        var diffuse_texture = new Texture("textures/ground.jpg", scene);

        diffuse_texture.uScale = 12;
        diffuse_texture.vScale = 12;
        groundMaterial.diffuseTexture = diffuse_texture
        
        groundMaterial.specularColor = new Color3(0., 0., 0.);
        // ground.position.y = 6371000;
        
        ground.scaling.x = -1;
        
        // ground.material = groundMaterial;


        var satMaterial = new StandardMaterial("sat", scene);
        var diffuse_texture = new Texture("textures/sat.png", scene);
        satMaterial.diffuseTexture = diffuse_texture
        ground.material = satMaterial;
        
        // Sky material
        var skyboxMaterial = new SkyMaterial("skyMaterial", scene);
        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.inclination = 0.4;
        //skyboxMaterial._cachedDefines.FOG = true;

        // Sky mesh (box)
        var skybox = MeshBuilder.CreateBox("skyBox", {size: 100*this.radius}, scene);
        skybox.material = skyboxMaterial;
    }
}