export type Face = "right" | "left" | "top" | "bottom" | "front" | "back";
export type Images = Record<Face, ImageBitmap>;

export class Cubemap {
	private gl: WebGL2RenderingContextStrict;
	private texture: WebGLTexture;

	constructor(gl: WebGL2RenderingContextStrict, images: Images) {
		this.gl = gl;

		const targets: Record<Face, WebGLRenderingContextStrict.TexImage2DTarget> = {
			right: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
			left: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
			top: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
			bottom: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
			front: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
			back: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
		};

		this.texture = this.gl.createTexture()!;
		this.bind();
		Object.entries(images).forEach(([face, image]) => {
			const target = targets[face as Face];
			this.gl.texImage2D(
				target,
				0,
				this.gl.RGBA,
				image.width,
				image.height,
				0,
				this.gl.RGBA,
				this.gl.UNSIGNED_BYTE,
				image,
			);

			this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
			this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_R, this.gl.CLAMP_TO_EDGE);
		});
		this.unbind();
	}

	public bind() {
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
	}

	public unbind() {
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
	}

	public destroy() {
		this.gl.deleteTexture(this.texture);
	}
}
