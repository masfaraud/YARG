import { Scene } from "@babylonjs/core";
import { SpaceCraft } from './spacecrafts';
import { Control, Slider, AdvancedDynamicTexture, TextBlock, Button, StackPanel}  from '@babylonjs/gui/2D';

export class GUI{

    throttle: Slider;
    spacecraft: SpaceCraft;
    altitude_gauge: TextBlock;
    speed_gauge: TextBlock;

    scene: Scene;

    constructor(
        // canvas: HTMLCanvasElement,
         scene:Scene, spacecraft: SpaceCraft){


        // Babylon GUI
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.spacecraft = spacecraft;
        this.scene = scene;

        
        // Gauge Panel 
        var panel = new StackPanel();
        panel.width = "220px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.paddingBottom = 50;
        panel.background = "#1A1C48";
        panel.color = "#9499C3";
        advancedTexture.addControl(panel);

        var speed_label = new TextBlock();
        speed_label.text = "SPEED";
        speed_label.left = 0;
        speed_label.height = "30px";
        speed_label.color = "#9499C3";
        panel.addControl(speed_label); 

        this.speed_gauge = new TextBlock();
        this.speed_gauge.text = "- m/s";
        this.speed_gauge.height = "30px";
        this.speed_gauge.color = "white";
        // this.speed_gauge.paddingBottom = 50;
        panel.addControl(this.speed_gauge); 

        var altitude_label = new TextBlock();
        altitude_label.text = "ALTITUDE";
        altitude_label.left = 0;
        altitude_label.height = "30px";
        altitude_label.color = "#9499C3";
        panel.addControl(altitude_label); 

        this.altitude_gauge = new TextBlock();
        this.altitude_gauge.text = "- m";
        this.altitude_gauge.height = "30px";
        this.altitude_gauge.color = "white";
        // panel.paddingBottom = 50;
        panel.addControl(this.altitude_gauge); 

        var header = new TextBlock();
        header.text = "MAIN ENGINE THROTTLE";
        header.height = "30px";
        // header.color = "white";
        panel.addControl(header); 


        // // Throttle
        this.throttle = new Slider();
        this.throttle.minimum = 0.;
        this.throttle.maximum = 1.;
        this.throttle.value = 0.;
        this.throttle.height = "20px";
        this.throttle.width = "150px";
        this.throttle.color = "green";
        this.throttle.background = "#777";
        // this.throttle.left = "40px";
        // this.throttle. = "40px";

        // this.throttle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        // this.throttle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.throttle.onValueChangedObservable.add( (value) => {
            this.spacecraft.update_throttle(value);
        });
        panel.addControl(this.throttle); 
 

        var camera_panel = new StackPanel();
        camera_panel.isVertical = true;
        camera_panel.width = "80px";

        camera_panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        camera_panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        camera_panel.top = 50;
        camera_panel.background = "#1A1C48";
        camera_panel.color = "#9499C3";
        advancedTexture.addControl(camera_panel);

        for (let camera of this.scene.cameras){
            var button = Button.CreateSimpleButton("camera button", camera.name);
            // button.width = "50px";
            button.height = "40px";
            button.color = "white";
            button.onPointerClickObservable.add(() => {
                this.scene.activeCamera = camera;
                camera.attachControl()
            })
            // button.background = "green";
            camera_panel.addControl(button);  
        }

        // Debug




        // Web

        // var debug_button = document.createElement("button");
        // debug_button.style.top = "80px";
        // debug_button.style.left = "30px";
        // debug_button.textContent = "debug";
        // debug_button.style.width = "50px"
        // debug_button.style.height = "40px"
    
        // debug_button.style.position = "absolute";
        // debug_button.style.color = "black";
    
        // document.body.appendChild(debug_button);

        // debug_button.addEventListener("click", () => {
        //     scene.debugLayer.show()
        // })

        // var fuel_gauge = document.createElement("meter");
        // fuel_gauge.style.top = "150px";
        // fuel_gauge.style.left = "30px";
        // fuel_gauge.value = 60;
        // fuel_gauge.min = 0;
        // fuel_gauge.max = 100;
        // fuel_gauge.optimum = 80;
        // fuel_gauge.low = 30;
        
        // fuel_gauge.style.position = "absolute";

        // document.body.appendChild(fuel_gauge);


    
    }

    update(){
        this.altitude_gauge.text = String(this.spacecraft.root.position.y.toFixed(0)) + " m"
        this.speed_gauge.text = String(this.spacecraft.speed.length().toFixed(0)) + " m/s"
        
    }

}