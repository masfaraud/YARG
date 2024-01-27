import {Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Color3} from "@babylonjs/core";
import {SkyMaterial} from "@babylonjs/materials"


export class Earth{
    mesh: Mesh;

    constructor(private scene:Scene) {
        // this.mesh = MeshBuilder.CreateSphere("earth", { diameter: 2000 }, scene);

        // Ground
        var ground = MeshBuilder.CreateGroundFromHeightMap("ground", "textures/heightMap.png", {width: 1000, height: 1000, subdivisions: 200, minHeight:-50, maxHeight: 0}, scene);
        var groundMaterial = new StandardMaterial("ground", scene);
        var diffuse_texture = new Texture("textures/ground.jpg", scene);
        diffuse_texture.uScale = 12;
        diffuse_texture.vScale = 12;
        groundMaterial.diffuseTexture = diffuse_texture
        
        groundMaterial.specularColor = new Color3(0, 0, 0);
        ground.position.y = -2.05;
        ground.material = groundMaterial;
        
        // Sky material
        var skyboxMaterial = new SkyMaterial("skyMaterial", scene);
        skyboxMaterial.backFaceCulling = false;

        skyboxMaterial.inclination = 0.4;
        //skyboxMaterial._cachedDefines.FOG = true;

        // Sky mesh (box)
        var skybox = MeshBuilder.CreateBox("skyBox", {size: 1000.0}, scene);
        skybox.material = skyboxMaterial;
    }
}