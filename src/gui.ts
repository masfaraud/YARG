import { Control, Slider, AdvancedDynamicTexture, TextBlock, Button} from 'babylonjs-gui';
import { Scene } from "@babylonjs/core";

export class GUI{

    constructor(
        // canvas: HTMLCanvasElement,
         scene:Scene){
        // Babylon GUI
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene=scene);

        var button1 = Button.CreateSimpleButton("but1", "Click Me");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        advancedTexture.addControl(button1);  
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

}