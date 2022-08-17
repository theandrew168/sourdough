import { mat4 } from 'gl-matrix';

import { readOBJ } from './model/obj';
import { VertexBuffer } from './webgl/vertexbuffer';
import { Shader } from './webgl/shader';
import { VERTEX_FORMATS } from './vertexformat';
import { Model } from './model';

async function main() {
	console.log(mat4.create());

	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
	const gl = canvas.getContext('webgl2') as unknown as WebGL2RenderingContextStrict;
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	const shader = await Shader.fromPath(gl, '/shader/hello_vert.glsl', '/shader/hello_frag.glsl');

	const objResp = await fetch('/model/bunny.obj');
	const obj = await objResp.text();

	const model = readOBJ(obj);
	console.log(model);

	const triangle: Model = {
		format: VERTEX_FORMATS.P2F,
		vertices: new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]),
	};
	const buffer = new VertexBuffer(gl, triangle);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		checkResize(gl);
		gl.clearColor(0.2, 0.3, 0.4, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		shader.bind();
		buffer.bind();
		gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
		buffer.unbind();
		shader.unbind();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}

function checkResize(gl: WebGL2RenderingContextStrict) {
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
