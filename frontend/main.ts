import { mat4 } from 'gl-matrix';

import { readOBJ } from './model/obj';
import { VertexBuffer } from './webgl/vertexbuffer';
import { Shader } from './webgl/shader';
import { Texture } from './webgl/texture';

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

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	const shader = await Shader.fromPath(gl, '/shader/basic_vert.glsl', '/shader/basic_frag.glsl');

	const imageSourceResp = await fetch('/texture/crate.png');
	const imageSource = await imageSourceResp.blob();
	const imageBitmap = await createImageBitmap(imageSource);
	const texture = new Texture(gl, imageBitmap);

	const modelSourceResp = await fetch('/model/cube.obj');
	const modelSource = await modelSourceResp.text();

	const model = readOBJ(modelSource);
	const buffer = new VertexBuffer(gl, model);

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
		mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -4.0]);
		mat4.rotateZ(modelMatrix, modelMatrix, now);
		mat4.rotateY(modelMatrix, modelMatrix, now * 0.7);

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

		gl.activeTexture(gl.TEXTURE0);
		texture.bind();
		shader.bind();
		shader.setUniformInt('uSampler', 0);
		shader.setUniformMat4('uMVP', mvpMatrix);
		buffer.bind();
		gl.drawArrays(buffer.drawMode, 0, buffer.count);
		buffer.unbind();
		texture.unbind();
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
