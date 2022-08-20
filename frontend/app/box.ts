import * as math from 'gl-matrix';

import * as asset from '../asset';
import * as camera from '../camera';
import * as obj from '../model/obj';
import * as resize from '../resize';
import * as vertexbuffer from '../webgl/vertexbuffer';
import * as shader from '../webgl/shader';
import * as texture from '../webgl/texture';

export async function main() {
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

	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	const basicVertSource = await asset.loadText('/shader/basic_vert.glsl');
	const basicFragSource = await asset.loadText('/shader/basic_frag.glsl');
	const basicShader = new shader.Shader(gl, basicVertSource, basicFragSource);

	const crateImage = await asset.loadImage('/texture/crate.png');
	const crateTexture = new texture.Texture(gl, crateImage);

	const cubeSource = await asset.loadText('/model/cube.obj');
	const cubeModel = obj.createModel(cubeSource);
	const cubeBuffer = new vertexbuffer.VertexBuffer(gl, cubeModel);

	const cam = new camera.Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

	// super simple camera movement demo
	canvas.addEventListener('touchstart', (ev) => {
		const touch = ev.touches[0];
		console.log('touch', touch.clientX, touch.clientY);
		if (touch.clientX < gl.canvas.clientWidth / 2) {
			cam.moveX(-0.25);
		} else {
			cam.moveX(0.25);
		}
	});

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		resize.check(gl);
		cam.setDimensions(gl.canvas.clientWidth, gl.canvas.clientHeight);

		gl.clearColor(0, 0, 0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const viewMatrix = cam.view();
		const projectionMatrix = cam.perspective();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = math.mat4.create();
		math.mat4.rotateZ(modelMatrix, modelMatrix, now);
		math.mat4.rotateY(modelMatrix, modelMatrix, now * 0.7);

		// multiply MVP matrices together (backwards)
		const mvpMatrix = math.mat4.create();
		math.mat4.mul(mvpMatrix, projectionMatrix, viewMatrix);
		math.mat4.mul(mvpMatrix, mvpMatrix, modelMatrix);

		gl.activeTexture(gl.TEXTURE0);
		crateTexture.bind();
		basicShader.bind();
		basicShader.setUniformMat4('uMVP', mvpMatrix);
		basicShader.setUniformInt('uSampler', 0);
		cubeBuffer.bind();
		gl.drawArrays(cubeBuffer.drawMode, 0, cubeBuffer.count);
		cubeBuffer.unbind();
		crateTexture.unbind();
		basicShader.unbind();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}
