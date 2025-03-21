import { parseControllerData, ControllerStatus } from './controller-data';
import { webusb, WebUSBDevice } from 'usb';


export interface EndpointDetails {
    address: number;
    maxPacketSize: number;
}


export class Adapter {
    protected inEndpoint: EndpointDetails = { address: 0x81, maxPacketSize: 37 };
    protected OutEndpoint: EndpointDetails = { address: 0x02, maxPacketSize: 5 };
    protected vendorId: number;
    protected productId: number;
    protected adapter: WebUSBDevice | null = null;


    constructor(vendorId: number, productId: number) {
        this.vendorId = vendorId;
        this.productId = productId;
    }

    async start() {
        this.adapter = await webusb.requestDevice({
            filters: [{ vendorId: this.vendorId, productId: this.productId }]
        });
        if (!this.adapter) throw new Error("Device not found");
        this.adapter.open();
        this.adapter.selectConfiguration(1);
        this.adapter.claimInterface(0);
        this.adapter.transferOut(this.OutEndpoint.address, new Uint8Array([0x13]).buffer);
    }

    private async readRaw(): Promise<Buffer | undefined> {
        const result = await this.adapter?.transferIn(this.inEndpoint.address, this.inEndpoint.maxPacketSize);
        if (result && result.data) {
            return Buffer.from(result.data.buffer);
        }
        return undefined;
    }

    async read(): Promise<ControllerStatus[] | undefined> {
        const rawData = await this.readRaw();
        if (!rawData) return undefined;
        return parseControllerData(rawData);
    }

    async stop() {
        await this.adapter?.transferOut(this.OutEndpoint.address, new Uint8Array([0x14]).buffer);
        await this.adapter?.close();
    }
}
