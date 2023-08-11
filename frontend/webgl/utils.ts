export function initGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
	const gl = canvas.getContext("webgl2");
	if (!gl) {
		const msg = "Unable to initialize WebGL2. Your browser or machine may not support it.";
		alert(msg);
		throw new Error(msg);
	}

	console.log("WebGL Vendor:   %s\n", gl.getParameter(gl.VENDOR));
	console.log("WebGL Renderer: %s\n", gl.getParameter(gl.RENDERER));
	console.log("WebGL Version:  %s\n", gl.getParameter(gl.VERSION));
	console.log("GLSL Version:   %s\n", gl.getParameter(gl.SHADING_LANGUAGE_VERSION));

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	gl.frontFace(gl.CCW);

	return gl;
}

export function resizeGL(gl: WebGL2RenderingContext) {
	const canvas = gl.canvas as HTMLCanvasElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	if (gl.canvas.width != width || gl.canvas.height != height) {
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
	}
}
