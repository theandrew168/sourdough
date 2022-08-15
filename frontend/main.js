import { Mesh } from './webgl/mesh.js';
import { Shader } from './webgl/shader.js';

async function main() {
	const canvas = document.querySelector('#glCanvas');
	const gl = canvas.getContext('webgl2');
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	const shader = await Shader.fromPath(
		gl,
		'/shader/hello_vert.glsl',
		'/shader/hello_frag.glsl',
	);

	const mesh = await Mesh.fromPath(gl, '/model/sprite.obj');

	// kick off draw loop
	requestAnimationFrame(draw);
	function draw(now) {
		// convert to seconds
		now *= 0.001;

		checkResize(gl);
		gl.clearColor(0.2, 0.3, 0.4, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		shader.bind();
		mesh.bind();
		gl.drawArrays(gl.TRIANGLES, 0, mesh.count);
		mesh.unbind();
		shader.unbind();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}

function checkResize(gl) {
	const width = gl.canvas.clientWidth;
	const height = gl.canvas.clientHeight;
	if (gl.canvas.width != width || gl.canvas.height != height) {
		gl.canvas.width = width;
		gl.canvas.height = height;
		gl.viewport(0, 0, width, height);
		console.log('resize', width, height);
	}
}

main();
