import { ATTRIB_LOCATIONS } from './attrib';
import { VERTEX_FORMATS } from './vertexformat';

export class Mesh {
	private gl: WebGL2RenderingContextStrict;
	private vbo: WebGLBuffer;
	private vao: WebGLVertexArrayObject;
	public count: number;

	constructor(gl: WebGL2RenderingContextStrict) {
		this.gl = gl;

		const format = VERTEX_FORMATS.P2F;
		const data = [-0.5, -0.5, 0, 0.5, 0.5, -0.5];
		const components = format.reduce((sum, fmt) => sum + fmt.size, 0);
		const stride = components * Float32Array.BYTES_PER_ELEMENT;
		this.count = data.length / components;

		this.vbo = this.gl.createBuffer()!;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);

		this.vao = this.gl.createVertexArray()!;
		this.bind();

		let offset = 0;
		for (const { component, size } of format) {
			const loc = ATTRIB_LOCATIONS[component].location;
			this.gl.enableVertexAttribArray(loc);
			this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, stride, offset);

			const bytes = size * Float32Array.BYTES_PER_ELEMENT;
			offset += bytes;
		}

		this.unbind();
	}

	public bind() {
		this.gl.bindVertexArray(this.vao);
	}

	public unbind() {
		this.gl.bindVertexArray(null);
	}

	public destroy() {
		this.gl.deleteVertexArray(this.vao);
		this.gl.deleteBuffer(this.vbo);
	}
}
