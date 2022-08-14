import { OBJ } from 'webgl-obj-loader';

export class Model {
	constructor(gl, obj) {
		this.gl = gl;
		this.obj = obj;
		this.vao = this.gl.createVertexArray();
	}

	static async fromPath(gl, modelPath) {
		const modelSourceResp = await fetch(modelPath);
		const modelSource = await modelSourceResp.text();

		const obj = new OBJ.Mesh(modelSource);
		const model = new Model(gl, obj);
		return model;
	}

	bind() {
		this.gl.bindVertexArray(this.vao);
	}

	unbind() {
		this.gl.bindVertexArray(null);
	}
}
