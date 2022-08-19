import * as math from 'gl-matrix';

import * as obj from './model/obj';
import * as vertexbuffer from './webgl/vertexbuffer';
import * as shader from './webgl/shader';
import * as texture from './webgl/texture';

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

	const vertSourceResp = await fetch('/shader/basic_vert.glsl');
	const vertSource = await vertSourceResp.text();

	const fragSourceResp = await fetch('/shader/basic_frag.glsl');
	const fragSource = await fragSourceResp.text();
	const basicShader = new shader.Shader(gl, vertSource, fragSource);

	const imageSourceResp = await fetch('/texture/crate.png');
	const imageSource = await imageSourceResp.blob();
	const imageBitmap = await createImageBitmap(imageSource);
	const crateTexture = new texture.Texture(gl, imageBitmap);

	const modelSourceResp = await fetch('/model/cube.obj');
	const modelSource = await modelSourceResp.text();

	const model = obj.createModel(modelSource);
	const buffer = new vertexbuffer.VertexBuffer(gl, model);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		checkResize(gl);
		gl.clearColor(0, 0, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = math.mat4.create();
		math.mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, -4.0]);
		math.mat4.rotateZ(modelMatrix, modelMatrix, now);
		math.mat4.rotateY(modelMatrix, modelMatrix, now * 0.7);

		const viewMatrix = math.mat4.create();
		math.mat4.identity(viewMatrix);

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
		const projectionMatrix = math.mat4.create();
		math.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

		// multiply MVP matrices together (backwards)
		const mvpMatrix = math.mat4.create();
		math.mat4.mul(mvpMatrix, projectionMatrix, viewMatrix);
		math.mat4.mul(mvpMatrix, mvpMatrix, modelMatrix);

		gl.activeTexture(gl.TEXTURE0);
		crateTexture.bind();
		basicShader.bind();
		basicShader.setUniformInt('uSampler', 0);
		basicShader.setUniformMat4('uMVP', mvpMatrix);
		buffer.bind();
		gl.drawArrays(buffer.drawMode, 0, buffer.count);
		buffer.unbind();
		crateTexture.unbind();
		basicShader.unbind();

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
