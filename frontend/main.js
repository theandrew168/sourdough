import { mat4 } from 'gl-matrix';

import { Mesh } from './webgl/mesh.js';
import { Shader } from './webgl/shader.js';

async function main() {
	console.log(mat4.create());

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
	shader.bind();
	shader.unbind();
	console.log(shader);

	const mesh = await Mesh.fromPath(gl, '/model/sprite.obj');
	mesh.bind();
	mesh.unbind();
	console.log(mesh);

	const textureImageResp = await fetch('/texture/bird.png');
	const textureImage = await textureImageResp.blob();
	const imageBitmap = await createImageBitmap(textureImage);
	console.log(imageBitmap);

	// an async approach
	fetch('/texture/bg.jpg')
		.then((resp) => {
			if (!resp.ok) {
				throw new Error('file not found');
			}
			return resp.blob();
		})
		.then((blob) => createImageBitmap(blob))
		.then((bitmap) => console.log(bitmap))
		.catch((err) => console.error(err));

	// kick off draw loop
	requestAnimationFrame(draw);
	function draw(now) {
		// convert to seconds
		now *= 0.001;

		checkResize(gl);
		gl.clearColor(Math.sin(now), 0.3, Math.cos(now), 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

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
