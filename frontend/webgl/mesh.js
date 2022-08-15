import { OBJ } from 'webgl-obj-loader';

import { AttribLocation } from './attrib.js';

export const VertexFormat = {
	P2F: [{ attrib: 'position', size: 2 }],
	P3F: [{ attrib: 'position', size: 3 }],
	P3F_T2F: [
		{ attrib: 'position', size: 3 },
		{ attrib: 'texcoord', size: 2 },
	],
	P3F_N3F: [
		{ attrib: 'position', size: 3 },
		{ attrib: 'normal', size: 3 },
	],
	P3F_T2F_N3F: [
		{ attrib: 'position', size: 3 },
		{ attrib: 'texcoord', size: 2 },
		{ attrib: 'normal', size: 3 },
	],
};

// TODO: impl this
function loadOBJ(source) {
	const format = VertexFormat.P2F;
	const data = [-0.5, -0.5, 0, 0.5, 0.5, -0.5];
	return { format, data };
}

export class Mesh {
	constructor(gl, meshSource) {
		this.gl = gl;

		const { format, data } = loadOBJ(meshSource);
		const components = format.reduce((sum, fmt) => sum + fmt.size, 0);
		const stride = components * Float32Array.BYTES_PER_ELEMENT;
		this.count = data.length / components;

		this.vbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

		this.vao = this.gl.createVertexArray();
		this.bind();

		let offset = 0;
		for (const { attrib, size } of format) {
			const loc = AttribLocation[attrib].location;
			this.gl.enableVertexAttribArray(loc);
			this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, stride, offset);

			const bytes = size * Float32Array.BYTES_PER_ELEMENT;
			offset += bytes;
		}

		this.unbind();
	}

	static async fromPath(gl, modelPath) {
		const modelSourceResp = await fetch(modelPath);
		const modelSource = await modelSourceResp.text();

		const obj = new OBJ.Mesh(modelSource);
		const mesh = new Mesh(gl, obj);
		return mesh;
	}

	bind() {
		this.gl.bindVertexArray(this.vao);
	}

	unbind() {
		this.gl.bindVertexArray(null);
	}

	destroy() {
		this.gl.deleteVertexArray(this.vao);
		this.gl.deleteBuffer(this.vbo);
	}
}
