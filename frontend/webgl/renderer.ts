import { mat4, vec4 } from "gl-matrix";

import { Shader } from "./shader";
import { Texture } from "./texture";
import { resizeGL } from "./utils";

const FLOAT_SIZE = 4;
const FLOATS_PER_VERTEX = 4;
const VERTEX_SIZE = FLOAT_SIZE * FLOATS_PER_VERTEX;

const MAX_SPRITE_COUNT = 1000;

const VERTICES_PER_SPRITE = 4;
const MAX_VERTEX_COUNT = MAX_SPRITE_COUNT * VERTICES_PER_SPRITE;

const INDICES_PER_SPRITE = 6;
const MAX_INDEX_COUNT = MAX_SPRITE_COUNT * INDICES_PER_SPRITE;

const TODO_IMAGE_SIZE = 64;

const VERTEX_SHADER = `
#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat4 uProjection;

void main() {
	vTexCoord = aTexCoord;
	gl_Position = uProjection * vec4(aPosition, 0, 1);
}
`;

const FRAGMENT_SHADER = `
#version 300 es
precision highp float;

in vec2 vTexCoord;

out vec4 vFragColor;

uniform sampler2D uTexture;

void main() {
	vFragColor = texture(uTexture, vTexCoord);
}
`;

type DrawParams = {
	x: number;
	y: number;
	sx?: number;
	sy?: number;
	r?: number;
};

export class Renderer2D {
	private canvas: HTMLCanvasElement;
	private gl: WebGL2RenderingContext;

	private shader: Shader;
	private vbo: WebGLBuffer;
	private ibo: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private count: number;
	private buffer: Float32Array;
	private texture: Texture;

	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, spritesheet: ImageBitmap) {
		this.canvas = canvas;
		this.gl = gl;

		this.shader = new Shader(gl, VERTEX_SHADER.trim(), FRAGMENT_SHADER.trim());
		this.shader.bind();

		this.vao = gl.createVertexArray()!;
		gl.bindVertexArray(this.vao);

		this.vbo = gl.createBuffer()!;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, VERTEX_SIZE * MAX_VERTEX_COUNT, gl.DYNAMIC_DRAW);

		// px, py
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, VERTEX_SIZE, 0);

		// tx, ty
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, VERTEX_SIZE, 2 * FLOAT_SIZE);

		// pre-compute sprite indices
		let offset = 0;
		const indices = new Uint16Array(MAX_INDEX_COUNT);
		for (let i = 0; i < MAX_INDEX_COUNT; i += 6) {
			indices[i + 0] = 0 + offset;
			indices[i + 1] = 1 + offset;
			indices[i + 2] = 2 + offset;

			indices[i + 3] = 2 + offset;
			indices[i + 4] = 3 + offset;
			indices[i + 5] = 0 + offset;

			offset += 4;
		}

		this.ibo = gl.createBuffer()!;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

		gl.bindVertexArray(null);

		this.count = 0;
		this.buffer = new Float32Array(MAX_VERTEX_COUNT);
		this.texture = new Texture(gl, spritesheet);
	}

	// TODO: image details: width, height, BL=(0,0), TR=(1,1), Quad->SubQuad, first param?
	public draw({ x, y, sx = 1, sy = 1, r = 0 }: DrawParams) {
		const halfWidth = TODO_IMAGE_SIZE * sx / 2.0;
		const halfHeight = TODO_IMAGE_SIZE * sy / 2.0;

		const radians = r * (Math.PI / 180.0);
		const sinRot = Math.sin(radians);
		const cosRot = Math.cos(radians);

		const index = this.count * FLOATS_PER_VERTEX * VERTICES_PER_SPRITE;

		// bottom-left
		this.buffer[index + 0] = cosRot * (x - halfWidth) - sinRot * (y - halfHeight);
		this.buffer[index + 1] = sinRot * (x - halfWidth) + cosRot * (y - halfHeight);
		this.buffer[index + 2] = 0.0;
		this.buffer[index + 3] = 0.0;

		// bottom-right
		this.buffer[index + 4] = cosRot * (x + halfWidth) - sinRot * (y - halfHeight);
		this.buffer[index + 5] = sinRot * (x + halfWidth) + cosRot * (y - halfHeight);
		this.buffer[index + 6] = 1.0;
		this.buffer[index + 7] = 0.0;

		// top-right
		this.buffer[index + 8] = cosRot * (x + halfWidth) - sinRot * (y + halfHeight);
		this.buffer[index + 9] = sinRot * (x + halfWidth) + cosRot * (y + halfHeight);
		this.buffer[index + 10] = 1.0;
		this.buffer[index + 11] = 1.0;

		// top-left
		this.buffer[index + 12] = cosRot * (x - halfWidth) - sinRot * (y + halfHeight);
		this.buffer[index + 13] = sinRot * (x - halfWidth) + cosRot * (y + halfHeight);
		this.buffer[index + 14] = 0.0;
		this.buffer[index + 15] = 1.0;

		const halfCanvasWidth = this.canvas.width / 2.0;
		const halfCanvasHeight = this.canvas.height / 2.0;

		const projection = mat4.create();
		mat4.ortho(projection, -halfCanvasWidth, halfCanvasWidth, -halfCanvasHeight, halfCanvasHeight, -1.0, 1.0);
		this.shader.setUniformMat4("uProjection", projection);

		this.count += 1;
	}

	public flush() {
		resizeGL(this.gl);
		this.gl.clearColor(0.2, 0.3, 0.4, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.texture.bind();
		this.gl.bindVertexArray(this.vao);
		this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.buffer);
		this.gl.drawElements(this.gl.TRIANGLES, this.count * INDICES_PER_SPRITE, this.gl.UNSIGNED_SHORT, 0);

		this.count = 0;
		this.buffer = new Float32Array(MAX_VERTEX_COUNT);
	}
}
