const GRID_SIZE = 32;

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
			@group(0) @binding(0) var<uniform> grid: vec2f;

			@vertex
			fn vertexMain(
				@location(0) pos: vec2f,
				@builtin(instance_index) instance: u32,
			) -> @builtin(position) vec4f {
				let i = f32(instance);
				let cell = vec2f(i % grid.x, floor(i / grid.x));
				let cellOffset = (cell / grid) * 2.0;
				let gridPos = (pos + 1.0) / grid - 1.0 + cellOffset;
				return vec4f(gridPos, 0.0, 1.0);
			}

			@fragment
			fn fragmentMain() -> @location(0) vec4f {
				return vec4f(1.0, 0.0, 0.0, 1.0);
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

	// Create a uniform buffer that describes the grid.
	const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
	const uniformBuffer = device.createBuffer({
		label: "Grid Uniforms",
		size: uniformArray.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	});
	device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

	const bindGroup = device.createBindGroup({
		label: "Cell renderer bind group",
		layout: cellPipeline.getBindGroupLayout(0),
		entries: [
			{
				binding: 0,
				resource: { buffer: uniformBuffer },
			},
		],
	});

	pass.setPipeline(cellPipeline);
	pass.setVertexBuffer(0, vertexBuffer);
	pass.setBindGroup(0, bindGroup);
	pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);

	pass.end();

	device.queue.submit([encoder.finish()]);
}
