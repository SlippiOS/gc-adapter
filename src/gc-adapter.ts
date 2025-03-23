import { parseControllerData, ControllerStatus } from "./controller-data";
import { webusb, WebUSBDevice } from "usb";

export interface EndpointDetails {
	address: number;
	maxPacketSize: number;
}

export class Adapter {
	private readonly ACTIVATE_ADAPTER_COMMAND = 0x13;
	private readonly DEACTIVATE_ADAPTER_COMMAND = 0x14;
	private readonly inEndpoint: EndpointDetails = {
		address: 0x81,
		maxPacketSize: 37,
	};
	private readonly OutEndpoint: EndpointDetails = {
		address: 0x02,
		maxPacketSize: 5,
	};

	private vendorId: number;
	private productId: number;
	private adapter: WebUSBDevice | null = null;

	constructor(vendorId: number, productId: number) {
		this.vendorId = vendorId;
		this.productId = productId;
	}

	async start() {
		this.adapter = await webusb.requestDevice({
			filters: [{ vendorId: this.vendorId, productId: this.productId }],
		});
		if (!this.adapter) throw new Error("Device not found");
		await this.adapter.open(); 
		await this.adapter.claimInterface(0); 
		this.adapter.selectConfiguration(1); 
		this.adapter.transferOut(
			this.OutEndpoint.address,
			new Uint8Array([this.ACTIVATE_ADAPTER_COMMAND]).buffer,
		); 
	}

	private async readRaw(): Promise<Buffer | undefined> {
		const result = await this.adapter?.transferIn(
			this.inEndpoint.address,
			this.inEndpoint.maxPacketSize,
		);
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
		await this.adapter?.transferOut(
			this.OutEndpoint.address,
			new Uint8Array([this.DEACTIVATE_ADAPTER_COMMAND]).buffer,
		);
		await this.adapter?.close();
	}
}
