import * as math from 'gl-matrix';

import * as asset from '../asset';
import * as camera from '../camera';
import * as obj from '../model/obj';
import * as vertexbuffer from '../webgl/vertexbuffer';
import * as shader from '../webgl/shader';
import * as texture from '../webgl/texture';
import * as utils from '../webgl/utils';

export async function main() {
	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
	const gl = utils.initGL(canvas);

	gl.clearColor(0.2, 0.3, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const s = new shader.Shader(
		gl,
		await asset.loadText('/shader/box_vert.glsl'),
		await asset.loadText('/shader/box_frag.glsl'),
	);

	const t = new texture.Texture(gl, await asset.loadImage('/texture/crate.png'));

	const m = obj.createModel(await asset.loadText('/model/cube.obj'));
	const b = new vertexbuffer.VertexBuffer(gl, m);

	const cam = new camera.Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		utils.resizeGL(gl);
		cam.setDimensions(gl.canvas.clientWidth, gl.canvas.clientHeight);

		gl.clearColor(0.2, 0.3, 0.4, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const viewMatrix = cam.view();
		const projectionMatrix = cam.perspective();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = math.mat4.create();
		math.mat4.rotateX(modelMatrix, modelMatrix, now * 1.3);
		math.mat4.rotateZ(modelMatrix, modelMatrix, now);
		math.mat4.rotateY(modelMatrix, modelMatrix, now * 0.7);

		// multiply MVP matrices together (backwards)
		const mvpMatrix = math.mat4.create();
		math.mat4.mul(mvpMatrix, projectionMatrix, viewMatrix);
		math.mat4.mul(mvpMatrix, mvpMatrix, modelMatrix);

		t.bind();
		s.bind();
		s.setUniformMat4('uMVP', mvpMatrix);
		s.setUniformInt('uSampler', 0);
		b.bind();
		gl.drawArrays(b.drawMode, 0, b.count);

		// continue draw loop
		requestAnimationFrame(draw);
	}
}
