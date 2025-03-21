import { parseControllerData } from './controller-data';
import { webusb } from 'usb';
export class Adapter {
    inEndpoint = { address: 0x81, maxPacketSize: 37 };
    OutEndpoint = { address: 0x02, maxPacketSize: 5 };
    vendorId;
    productId;
    adapter = null;
    constructor(vendorId, productId) {
        this.vendorId = vendorId;
        this.productId = productId;
    }
    async start() {
        this.adapter = await webusb.requestDevice({
            filters: [{ vendorId: this.vendorId, productId: this.productId }]
        });
        if (!this.adapter)
            throw new Error("Device not found");
        this.adapter.open();
        this.adapter.selectConfiguration(1);
        this.adapter.claimInterface(0);
        this.adapter.transferOut(this.OutEndpoint.address, new Uint8Array([0x13]).buffer);
    }
    async readRaw() {
        const result = await this.adapter?.transferIn(this.inEndpoint.address, this.inEndpoint.maxPacketSize);
        if (result && result.data) {
            return Buffer.from(result.data.buffer);
        }
        return undefined;
    }
    async read() {
        const rawData = await this.readRaw();
        if (!rawData)
            return undefined;
        return parseControllerData(rawData);
    }
    async stop() {
        await this.adapter?.transferOut(this.OutEndpoint.address, new Uint8Array([0x14]).buffer);
        await this.adapter?.close();
    }
}
