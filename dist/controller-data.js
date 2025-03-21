export const buttons = {
    buttonA: { byte: 1, bitmask: 0x01 },
    buttonB: { byte: 1, bitmask: 0x02 },
    buttonX: { byte: 1, bitmask: 0x04 },
    buttonY: { byte: 1, bitmask: 0x08 },
    padUp: { byte: 1, bitmask: 0x80 },
    padDown: { byte: 1, bitmask: 0x40 },
    padLeft: { byte: 1, bitmask: 0x10 },
    padRight: { byte: 1, bitmask: 0x20 },
    buttonStart: { byte: 2, bitmask: 0x01 },
    buttonZ: { byte: 2, bitmask: 0x02 },
    buttonL: { byte: 2, bitmask: 0x08 },
    buttonR: { byte: 2, bitmask: 0x04 },
    connected: { byte: 0, bitmask: 0x10 }
};
export const axes = {
    mainStickHorizontal: { byte: 4, center: 128, range: 128 },
    mainStickVertical: { byte: 5, center: 128, range: 128, inverted: true },
    cStickHorizontal: { byte: 6, center: 128, range: 128 },
    cStickVertical: { byte: 7, center: 128, range: 128, inverted: true },
    triggerL: { byte: 8, center: 0, range: 255 },
    triggerR: { byte: 8, center: 0, range: 255 },
};
export function isPressed(portData, button) {
    return (portData[button.byte] & button.bitmask) !== 0;
}
export function isConnected(portData) {
    return isPressed(portData, buttons.connected);
}
export function getAxisValue(portData, axis) {
    let value = (portData[axis.byte] - axis.center) / axis.range;
    return axis.inverted ? -value : value;
}
export function parseControllerData(data) {
    return Array.from({ length: 4 }, (_, port) => {
        const offset = 9 * port;
        const portData = data.subarray(offset, offset + 9);
        return {
            port: port + 1,
            connected: isConnected(portData),
            buttons: {
                buttonA: isPressed(portData, buttons.buttonA),
                buttonB: isPressed(portData, buttons.buttonB),
                buttonX: isPressed(portData, buttons.buttonX),
                buttonY: isPressed(portData, buttons.buttonY),
                padUp: isPressed(portData, buttons.padUp),
                padDown: isPressed(portData, buttons.padDown),
                padLeft: isPressed(portData, buttons.padLeft),
                padRight: isPressed(portData, buttons.padRight),
                buttonStart: isPressed(portData, buttons.buttonStart),
                buttonZ: isPressed(portData, buttons.buttonZ),
                buttonL: isPressed(portData, buttons.buttonL),
                buttonR: isPressed(portData, buttons.buttonR),
            },
            axes: {
                mainStickHorizontal: getAxisValue(portData, axes.mainStickHorizontal),
                mainStickVertical: getAxisValue(portData, axes.mainStickVertical),
                cStickHorizontal: getAxisValue(portData, axes.cStickHorizontal),
                cStickVertical: getAxisValue(portData, axes.cStickVertical),
                triggerL: getAxisValue(portData, axes.triggerL),
                triggerR: getAxisValue(portData, axes.triggerR),
            },
        };
    });
}
