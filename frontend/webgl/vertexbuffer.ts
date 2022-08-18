import { ATTRIB_LOCATIONS } from './attrib';
import { vertexFormatSize, vertexFormatStride } from '../vertexformat';
import { DrawMode, Model } from '../model';

export class VertexBuffer {
	private gl: WebGL2RenderingContextStrict;
	private vbo: WebGLBuffer;
	private vao: WebGLVertexArrayObject;
	public drawMode: WebGLRenderingContextStrict.DrawMode;
	public count: number;

	constructor(gl: WebGL2RenderingContextStrict, model: Model) {
		this.gl = gl;

		const { format, drawMode, vertices } = model;
		this.drawMode = toWebGLDrawMode(this.gl, drawMode);

		const stride = vertexFormatStride(format);
		this.count = vertices.length / vertexFormatSize(format);

		this.vbo = this.gl.createBuffer()!;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

		this.vao = this.gl.createVertexArray()!;
		this.bind();

		let offset = 0;
		for (const { type, size } of format) {
			const loc = ATTRIB_LOCATIONS[type].location;
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
	drawMode: DrawMode,
): WebGLRenderingContextStrict.DrawMode {
	const webGLDrawModes: Record<DrawMode, WebGLRenderingContextStrict.DrawMode> = {
		[DrawMode.Triangles]: gl.TRIANGLES,
		[DrawMode.TriangleStrip]: gl.TRIANGLE_STRIP,
	};
	return webGLDrawModes[drawMode];
}
