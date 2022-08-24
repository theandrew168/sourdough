export function initGL(canvas: HTMLCanvasElement): WebGL2RenderingContextStrict {
	const gl = canvas.getContext('webgl2') as unknown as WebGL2RenderingContextStrict;
	if (!gl) {
		const msg = 'Unable to initialize WebGL. Your browser or machine may not support it.';
		alert(msg);
		throw new Error(msg);
	}

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	return gl;
}

export function resizeGL(gl: WebGL2RenderingContextStrict) {
	const width = gl.canvas.clientWidth;
	const height = gl.canvas.clientHeight;
	if (gl.canvas.width != width || gl.canvas.height != height) {
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
	}
}