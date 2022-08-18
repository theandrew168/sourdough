export class Texture {
	private gl: WebGL2RenderingContextStrict;
	private texture: WebGLTexture;

	constructor(gl: WebGL2RenderingContextStrict, imageBitmap: ImageBitmap) {
		this.gl = gl;

		this.texture = this.gl.createTexture()!;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		this.gl.texImage2D(
			this.gl.TEXTURE_2D,
			0,
			this.gl.RGBA,
			imageBitmap.width,
			imageBitmap.height,
			0,
			this.gl.RGBA,
			this.gl.UNSIGNED_BYTE,
			imageBitmap,
		);
		this.gl.generateMipmap(this.gl.TEXTURE_2D);
	}

	public bind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	}

	public unbind() {
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}

	public destroy() {
		this.gl.deleteTexture(this.texture);
	}
}
