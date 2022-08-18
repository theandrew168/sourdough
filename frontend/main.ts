import { mat4 } from 'gl-matrix';

import { readOBJ } from './model/obj';
import { VertexBuffer } from './webgl/vertexbuffer';
import { Shader } from './webgl/shader';
import { VertexType } from './vertexformat';
import { DrawMode, Model } from './model';

async function main() {
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

	const shader = await Shader.fromPath(gl, '/shader/basic_vert.glsl', '/shader/basic_frag.glsl');

	const objResp = await fetch('/model/bunny.obj');
	const obj = await objResp.text();

	const model = readOBJ(obj);
	console.log(model);

	const square: Model = {
		drawMode: DrawMode.TriangleStrip,
		format: [{ type: VertexType.Position, size: 2 }],
		vertices: new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]),
	};
	const buffer = new VertexBuffer(gl, square);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		checkResize(gl);
		gl.clearColor(0, 0, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = mat4.create();
		mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -6.0]);

		const viewMatrix = mat4.create();
		mat4.identity(viewMatrix);

		// Create a perspective matrix, a special matrix that is
		// used to simulate the distortion of perspective in a camera.
		// Our field of view is 45 degrees, with a width/height
		// ratio that matches the display size of the canvas
		// and we only want to see objects between 0.1 units
		// and 100 units away from the camera.

		const fieldOfView = (45 * Math.PI) / 180; // in radians
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		const projectionMatrix = mat4.create();
		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

		// multiply MVP matrices together (backwards)
		const mvpMatrix = mat4.create();
		mat4.mul(mvpMatrix, projectionMatrix, viewMatrix);
		mat4.mul(mvpMatrix, mvpMatrix, modelMatrix);

		shader.bind();
		shader.setUniformMat4('uMVP', mvpMatrix);
		buffer.bind();
		gl.drawArrays(buffer.drawMode, 0, buffer.count);
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
