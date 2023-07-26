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
	context.configure({ device, format });

	// prettier-ignore
	const vertices = new Float32Array([
		// X,    Y,
		-0.8, -0.8, // Triangle 1 (Blue)
		 0.8, -0.8,
		 0.8,  0.8,

		-0.8, -0.8, // Triangle 2 (Red)
		 0.8,  0.8,
		-0.8,  0.8,
	]);

	const vertexBuffer = device.createBuffer({
		label: "Cell vertices",
		size: vertices.byteLength,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(vertexBuffer, 0, vertices);

	const vertexBufferLayout: GPUVertexBufferLayout = {
		arrayStride: 8,
		attributes: [
			{
				format: "float32x2",
				offset: 0,
				shaderLocation: 0,
			},
		],
	};

	const cellShaderModule = device.createShaderModule({
		label: "Cell shader",
		code: `
			@vertex
			fn vertexMain(@location(0) pos: vec2f) ->
				@builtin(position) vec4f {
				return vec4f(pos, 0, 1);
			}

			@fragment
			fn fragmentMain() -> @location(0) vec4f {
				return vec4f(1, 0, 0, 1);
			}
		`,
	});

	const cellPipeline = device.createRenderPipeline({
		label: "Cell pipeline",
		layout: "auto",
		vertex: {
			module: cellShaderModule,
			entryPoint: "vertexMain",
			buffers: [vertexBufferLayout],
		},
		fragment: {
			module: cellShaderModule,
			entryPoint: "fragmentMain",
			targets: [
				{
					format,
				},
			],
		},
	});

	const encoder = device.createCommandEncoder();
	const texture = context.getCurrentTexture();
	const pass = encoder.beginRenderPass({
		colorAttachments: [
			{
				view: texture.createView(),
				loadOp: "clear",
				clearValue: [0.2, 0.3, 0.4, 1.0],
				storeOp: "store",
			},
		],
	});

	pass.setPipeline(cellPipeline);
	pass.setVertexBuffer(0, vertexBuffer);
	pass.draw(vertices.length / 2);

	pass.end();

	device.queue.submit([encoder.finish()]);
}
