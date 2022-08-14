import { OBJ } from 'webgl-obj-loader';

export class Mesh {
	constructor(gl, obj) {
		this.gl = gl;
		this.obj = obj;
		this.vao = this.gl.createVertexArray();
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
