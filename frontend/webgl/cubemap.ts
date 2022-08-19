export enum Face {
	Right,
	Left,
	Top,
	Bottom,
	Front,
	Back,
}

export type Images = Record<Face, ImageBitmap>;

export class Cubemap {
	private gl: WebGL2RenderingContextStrict;
	private texture: WebGLTexture;

	constructor(gl: WebGL2RenderingContextStrict, images: Images) {
		this.gl = gl;

		const faceToTarget: Record<Face, WebGLRenderingContextStrict.TexImage2DTarget> = {
			[Face.Right]: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
			[Face.Left]: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
			[Face.Top]: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
			[Face.Bottom]: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
			[Face.Front]: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
			[Face.Back]: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
		};
		console.log(faceToTarget);

		this.texture = this.gl.createTexture()!;
		this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);

		// Object.entries(images).forEach(([face, image]) => {
		// 	const target = faceToTarget[face];
		// 	this.gl.texImage2)
		// });
	}
}
