import { mat4 } from 'gl-matrix';

import { Shader } from './webgl/shader.js';

async function main() {
	console.log(mat4.create());

	const canvas = document.querySelector('#glCanvas');
	const gl = canvas.getContext('webgl2');
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	const vertSourceResp = await fetch('/shader/basic.vert.glsl');
	const vertSource = await vertSourceResp.text();

	const fragSourceResp = await fetch('/shader/basic.frag.glsl');
	const fragSource = await fragSourceResp.text();

	const s = new Shader(gl, vertSource, fragSource);
	console.log(s);

	gl.clearColor(0.2, 0.3, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

await main();
