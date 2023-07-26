export async function main(canvas: HTMLCanvasElement) {
	if (!navigator.gpu) {
		throw new Error("WebGPU not supported on this browser.");
	}

	const adapter = await navigator.gpu.requestAdapter();
	if (!adapter) {
		throw new Error("No appropriate GPUAdapter found.");
	}

	const device = await adapter.requestDevice();

	const context = canvas.getContext("webgpu");
	if (!context) {
		throw new Error("Failed to get canvas context.");
	}

	const format = navigator.gpu.getPreferredCanvasFormat();
	console.log("format: ", format);
	context.configure({ device, format });

	const encoder = device.createCommandEncoder();
	const texture = context.getCurrentTexture();
	const pass = encoder.beginRenderPass({
		colorAttachments: [
			{
				view: texture.createView(),
				loadOp: "clear",
				clearValue: { r: 0.2, g: 0.3, b: 0.4, a: 1 },
				storeOp: "store",
			},
		],
	});
	pass.end();

	const commandBuffer = encoder.finish();
	device.queue.submit([commandBuffer]);
}
