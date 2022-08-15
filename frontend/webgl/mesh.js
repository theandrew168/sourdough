import { OBJ } from 'webgl-obj-loader';

import { AttribLocation } from './attrib.js';

// size, stride
export const BufferFormat = {
	V2F: 2 * Float32Array.BYTES_PER_ELEMENT,
	V3F: 3 * Float32Array.BYTES_PER_ELEMENT,
	T2F_V3F: 5 * Float32Array.BYTES_PER_ELEMENT,
	N3F_V3F: 6 * Float32Array.BYTES_PER_ELEMENT,
	T2F_N3F_V3F: 8 * Float32Array.BYTES_PER_ELEMENT,
};

export class Mesh {
	constructor(gl, meshSource) {
		this.gl = gl;

		// TODO: derive this from meshSource (interface?)
		const fmt = BufferFormat.V2F;
		const size = 2;
		const stride = 8;
		const offset = 0;
		const data = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

		this.vbo = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

		this.vao = this.gl.createVertexArray();

		const position = AttribLocation.position.location;
		this.gl.enableVertexAttribArray(position);
		this.gl.vertexAttribPointer(position, size, this.gl.FLOAT, false, stride, offset);
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
}
