interface ControllerButtons {
    buttonA: boolean;
    buttonB: boolean;
    buttonX: boolean;
    buttonY: boolean;
    padUp: boolean;
    padDown: boolean;
    padLeft: boolean;
    padRight: boolean;
    buttonStart: boolean;
    buttonZ: boolean;
    buttonL: boolean;
    buttonR: boolean;
}
interface ControllerAxes {
    mainStickHorizontal: number;
    mainStickVertical: number;
    cStickHorizontal: number;
    cStickVertical: number;
    triggerL: number;
    triggerR: number;
}
export interface ControllerStatus {
    port: number;
    connected: boolean;
    buttons: ControllerButtons;
    axes: ControllerAxes;
}
interface ButtonDescriptor {
    byte: number;
    bitmask: number;
}
interface AxisDescriptor {
    byte: number;
    center: number;
    range: number;
    inverted?: boolean;
}
export declare const buttons: {
    [key: string]: ButtonDescriptor;
};
export declare const axes: {
    [key: string]: AxisDescriptor;
};
export declare function isPressed(portData: Buffer, button: ButtonDescriptor): boolean;
export declare function isConnected(portData: Buffer): boolean;
export declare function getAxisValue(portData: Buffer, axis: AxisDescriptor): number;
export declare function parseControllerData(data: Buffer): ControllerStatus[];
export {};
