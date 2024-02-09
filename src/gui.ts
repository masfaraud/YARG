import { Scene } from "@babylonjs/core";
import { SpaceCraft } from './spacecrafts';
import { Control, Slider, AdvancedDynamicTexture, TextBlock, Button, StackPanel } from '@babylonjs/gui/2D';

class ControlConfiguration {
    key1: string;
    key2: string;
    slider: Slider;
    sensitivity_down: number;
    sensitivity_up: number;

    constructor(key1: string,
        key2: string,
        sensitivity_down: number,
        sensitivity_up: number,
        slider: Slider) {
        this.key1 = key1;
        this.key2 = key2;
        this.slider = slider;
        this.sensitivity_down = sensitivity_down;
        this.sensitivity_up = sensitivity_up;
    }
}


export class GUI {

    throttle: Slider;
    pitch_command: Slider;
    yaw_command: Slider;
    roll_command: Slider;
    spacecraft: SpaceCraft;
    altitude_gauge: TextBlock;
    speed_gauge: TextBlock;

    keys_down: any;

    scene: Scene;

    control_configs: ControlConfiguration[]


    constructor(

        // canvas: HTMLCanvasElement,
        scene: Scene, spacecraft: SpaceCraft) {

        this.keys_down = {}

        // Babylon GUI
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
        this.spacecraft = spacecraft;
        this.scene = scene;


        // Gauge Panel 
        var panel = new StackPanel();
        panel.width = "240px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        panel.paddingBottom = 50;
        panel.background = "#1A1C48";
        panel.color = "#9499C3";
        advancedTexture.addControl(panel);

        this.addTextToPanel("SPEED", panel);

        this.speed_gauge = new TextBlock();
        this.speed_gauge.text = "- m/s";
        this.speed_gauge.height = "30px";
        this.speed_gauge.color = "white";

        panel.addControl(this.speed_gauge);

        this.addTextToPanel("ALTITUDE", panel);

        this.altitude_gauge = new TextBlock();
        this.altitude_gauge.text = "- m";
        this.altitude_gauge.height = "30px";
        this.altitude_gauge.color = "white";
        panel.addControl(this.altitude_gauge);


        // // Throttle
        this.addTextToPanel("MAIN ENGINE THROTTLE", panel);
        this.throttle = this.addSliderToPanel(panel);
        this.throttle.onValueChangedObservable.add((value) => {
            this.spacecraft.update_throttle(value);
        });

        // Pitch
        this.addTextToPanel("PITCH", panel);
        this.pitch_command = this.addSliderToPanel(panel, -1, 1);

        // Yaw
        this.addTextToPanel("YAW", panel);
        this.yaw_command = this.addSliderToPanel(panel, -1, 1);

        // Roll
        this.addTextToPanel("ROLL", panel);
        this.roll_command = this.addSliderToPanel(panel, -1, 1);

        this.control_configs = [
            new ControlConfiguration('a', 'e', 1.3, 0.9, this.roll_command),
            new ControlConfiguration('q', 'd', 1.3, 0.9, this.yaw_command),
            new ControlConfiguration('s', 'z', 1.3, 0.9, this.pitch_command)
        ]


        var camera_panel = new StackPanel();
        camera_panel.isVertical = true;
        camera_panel.width = "80px";

        camera_panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        camera_panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        camera_panel.top = 50;
        camera_panel.background = "#1A1C48";
        camera_panel.color = "#9499C3";
        advancedTexture.addControl(camera_panel);

        for (let camera of this.scene.cameras) {
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

    addTextToPanel(text: string, panel: StackPanel) {
        var label = new TextBlock();
        label.text = text;
        label.left = 0;
        label.height = "30px";
        label.color = "#9499C3";
        panel.addControl(label);
        return label
    }

    addSliderToPanel(panel: StackPanel, minimum: number = 0., maximum: number = 1.) {
        var slider = new Slider();
        slider.minimum = minimum;
        slider.maximum = maximum;
        slider.value = 0.;
        slider.height = "20px";
        slider.width = "150px";
        slider.color = "green";
        slider.background = "#777";

        panel.addControl(slider);
        return slider
    }

    updateDisplay() {
        this.altitude_gauge.text = String(this.spacecraft.root.position.y.toFixed(0)) + " m"
        this.speed_gauge.text = String(this.spacecraft.speed.length().toFixed(0)) + " m/s"

    }

    updateControls(delta_time: number) {
        // Stay at level control
        if (this.keys_down['Shift']) {
            this.throttle.value -= delta_time * 0.5;
        }
        else if (this.keys_down['CapsLock']) {
            this.throttle.value += delta_time * 0.5;
        }

        // Back to zero controls
        for (let control_config of this.control_configs) {
            let value = control_config.slider.value;
            if (this.keys_down[control_config.key1]) {
                control_config.slider.value -= delta_time * control_config.sensitivity_up;
            }
            else if (this.keys_down[control_config.key2]) {
                control_config.slider.value += delta_time * control_config.sensitivity_up;
            }
            else {
                let decrease = delta_time * control_config.sensitivity_down;
                if (Math.abs(control_config.slider.value) < decrease) {
                    control_config.slider.value = 0.;
                }
                else {
                    control_config.slider.value -= decrease * Math.sign(control_config.slider.value);
                }
            }
        }


    }

    updateDownKeys(event) {
        if (event.type == 'keydown') {
            this.keys_down[event.key] = true;
        }
        else if (event.type == 'keyup') {
            this.keys_down[event.key] = false;
        }

    }

}