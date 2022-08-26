import * as attrib from './attrib';
import * as vertex from '../vertex';
import * as model from '../model';

export class VertexArray {
	private gl: WebGL2RenderingContextStrict;
	private vbo: WebGLBuffer;
	private ibo?: WebGLBuffer;
	private vao: WebGLVertexArrayObject;
	private drawMode: WebGLRenderingContextStrict.DrawMode;
	private count: number;

	constructor(gl: WebGL2RenderingContextStrict, model: model.Model) {
		this.gl = gl;

		const { drawMode, format, vertices, indices } = model;
		const stride = vertex.formatStride(format);
		this.drawMode = toWebGLDrawMode(this.gl, drawMode);

		if (indices) {
			this.count = indices.length;
		} else {
			this.count = vertices.length / vertex.formatSize(format);
		}

		this.vao = this.gl.createVertexArray()!;
		this.bind();

		this.vbo = this.gl.createBuffer()!;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

		if (indices) {
			this.ibo = this.gl.createBuffer()!;
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ibo);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
		}

		let offset = 0;
		for (const { type, size } of format) {
			const loc = attrib.LOCATIONS[type].location;
			this.gl.enableVertexAttribArray(loc);
			this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, stride, offset);

			offset += size * 4;
		}

		this.unbind();
	}

	public draw() {
		if (this.ibo) {
			this.gl.drawElements(this.drawMode, this.count, this.gl.UNSIGNED_SHORT, 0);
		} else {
			this.gl.drawArrays(this.drawMode, 0, this.count);
		}
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
		if (this.ibo) {
			this.gl.deleteBuffer(this.ibo);
		}
	}
}

function toWebGLDrawMode(
	gl: WebGL2RenderingContextStrict,
	drawMode: model.DrawMode,
): WebGLRenderingContextStrict.DrawMode {
	const webGLDrawModes: Record<model.DrawMode, WebGLRenderingContextStrict.DrawMode> = {
		[model.DrawMode.Triangles]: gl.TRIANGLES,
		[model.DrawMode.TriangleStrip]: gl.TRIANGLE_STRIP,
	};
	return webGLDrawModes[drawMode];
}
