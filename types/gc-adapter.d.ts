import { ControllerStatus } from './controller-data';
import { WebUSBDevice } from 'usb';
export interface EndpointDetails {
    address: number;
    maxPacketSize: number;
}
export declare class Adapter {
    protected inEndpoint: EndpointDetails;
    protected OutEndpoint: EndpointDetails;
    protected vendorId: number;
    protected productId: number;
    protected adapter: WebUSBDevice | null;
    constructor(vendorId: number, productId: number);
    start(): Promise<void>;
    private readRaw;
    read(): Promise<ControllerStatus[] | undefined>;
    stop(): Promise<void>;
}
