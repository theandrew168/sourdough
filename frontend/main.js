import { mat4 } from 'gl-matrix';
import { OBJ } from 'webgl-obj-loader';

import { Shader } from './webgl/shader.js';

async function main() {
	console.log(mat4.create());

	const canvas = document.querySelector('#glCanvas');
	const gl = canvas.getContext('webgl2');
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	// resize now and setup window resize listener
	resize(gl);
	addEventListener('resize', (e) => {
		resize(gl);
	});

	const vertSourceResp = await fetch('/shader/basic_vert.glsl');
	const vertSource = await vertSourceResp.text();

	const fragSourceResp = await fetch('/shader/basic_frag.glsl');
	const fragSource = await fragSourceResp.text();

	const s = new Shader(gl, vertSource, fragSource);
	console.log(s);

	const modelSourceResp = await fetch('/model/sprite.obj');
	const modelSource = await modelSourceResp.text();
	console.log(modelSource);

	const model = new OBJ.Mesh(modelSource);
	console.log(model);

	const textureImageResp = await fetch('/texture/bird.png');
	const textureImage = await textureImageResp.blob();
	const imageBitmap = await createImageBitmap(textureImage);
	console.log(imageBitmap);

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

		gl.clearColor(Math.sin(now), 0.3, Math.cos(now), 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		requestAnimationFrame(draw);
	}
}

function resize(gl) {
	const width = gl.canvas.clientWidth;
	const height = gl.canvas.clientHeight;
	gl.canvas.width = width;
	gl.canvas.height = height;
	gl.viewport(0, 0, width, height);
	console.log('resize', width, height);
}

main();
