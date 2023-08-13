import { mat4 } from "gl-matrix";

import { Shader } from "./shader";
import { VertexArray } from "./vertexarray";
import { createModel } from "../loader/obj";
import { Texture } from "./texture";

const VERTEX_SHADER = `
#version 300 es

in vec4 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat4 uModel;
uniform mat4 uProjection;

void main() {
	vTexCoord = aTexCoord;
	gl_Position = uProjection * uModel * aPosition;
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

const SPRITE_OBJ = `
v  0.5  0.5  0.0
v -0.5  0.5  0.0
v -0.5 -0.5  0.0
v  0.5  0.5  0.0
v -0.5 -0.5  0.0
v  0.5 -0.5  0.0

vt 1 1
vt 0 1
vt 0 0
vt 1 1
vt 0 0
vt 1 0

f 1/1 2/2 3/3
f 4/4 5/5 6/6
`;

type DrawParams = {
	x: number;
	y: number;
	z?: number;
	sx?: number;
	sy?: number;
	r?: number;
};

export class Renderer2D {
	private canvas: HTMLCanvasElement;
	private gl: WebGL2RenderingContext;
	private shader: Shader;
	private vao: VertexArray;

	private textures: Record<string, Texture>;

	constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
		this.canvas = canvas;
		this.gl = gl;

		this.shader = new Shader(gl, VERTEX_SHADER.trim(), FRAGMENT_SHADER.trim());
		this.shader.bind();

		const model = createModel(SPRITE_OBJ);
		this.vao = new VertexArray(gl, model);
		this.vao.bind();

		this.textures = {};
	}

	public loadImage(name: string, image: ImageBitmap) {
		// replace an existing image with the same name, if present
		const existing = this.textures[name];
		if (existing) {
			existing.destroy();
			delete this.textures[name];
		}

		const texture = new Texture(this.gl, image);
		this.textures[name] = texture;
	}

	public drawImage(name: string, { x, y, z = 0, sx = 1, sy = 1, r = 0 }: DrawParams) {
		const texture = this.textures[name];
		if (!texture) {
			throw new Error(`Unknown image: ${name}. Was it loaded?`);
		}

		const model = mat4.create();
		mat4.translate(model, model, [x, y, z]);
		mat4.rotateZ(model, model, r * (Math.PI / 180.0));
		mat4.scale(model, model, [sx * texture.width, sy * texture.height, 1]);
		this.shader.setUniformMat4("uModel", model);

		const halfWidth = this.canvas.width / 2.0;
		const halfHeight = this.canvas.height / 2.0;

		const projection = mat4.create();
		mat4.ortho(projection, -halfWidth, halfWidth, -halfHeight, halfHeight, -1.0, 1.0);
		this.shader.setUniformMat4("uProjection", projection);

		texture.bind();
		this.vao.draw();
		texture.unbind();
	}
}
