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
	gl_Position = aPosition;
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

export class Renderer2D {
	private gl: WebGL2RenderingContext;
	private shader: Shader;
	private vao: VertexArray;

	private textures: Record<string, Texture>;

	constructor(_canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
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

	public drawImage(name: string) {
		const texture = this.textures[name];
		if (!texture) {
			throw new Error(`Unknown image: ${name}. Was it loaded?`);
		}

		texture.bind();
		this.vao.draw();
		texture.unbind();
	}
}
