import * as attrib from './attrib';
import * as vertex from '../vertex';
import * as model from '../model';

export class VertexBuffer {
	private gl: WebGL2RenderingContextStrict;
	private vbo: WebGLBuffer;
	private vao: WebGLVertexArrayObject;
	public drawMode: WebGLRenderingContextStrict.DrawMode;
	public count: number;

	constructor(gl: WebGL2RenderingContextStrict, model: model.Model) {
		this.gl = gl;

		const { format, drawMode, vertices } = model;
		this.drawMode = toWebGLDrawMode(this.gl, drawMode);

		const stride = vertex.vertexFormatStride(format);
		this.count = vertices.length / vertex.vertexFormatSize(format);

		this.vbo = this.gl.createBuffer()!;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

		this.vao = this.gl.createVertexArray()!;
		this.bind();

		let offset = 0;
		for (const { type, size } of format) {
			const loc = attrib.LOCATIONS[type].location;
			this.gl.enableVertexAttribArray(loc);
			this.gl.vertexAttribPointer(loc, size, this.gl.FLOAT, false, stride, offset);

			offset += size * 4;
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
