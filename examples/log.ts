import { Adapter } from "../src";

const adapter = new Adapter(0x057e, 0x0337);

async function main() {
	await adapter.start();
	while (true) {
		const data = await adapter.read();
		if (data) {
			console.log(data);
		}
	}
}

main();
