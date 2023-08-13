export class Texture {
	private gl: WebGL2RenderingContext;
	private texture: WebGLTexture;
	public width;
	public height;

	constructor(gl: WebGL2RenderingContext, imageBitmap: ImageBitmap) {
		this.gl = gl;

		this.texture = this.gl.createTexture()!;
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
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
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);

		this.width = imageBitmap.width;
		this.height = imageBitmap.height;
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
