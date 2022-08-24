import * as math from 'gl-matrix';

import * as asset from '../asset';
import * as camera from '../camera';
import * as obj from '../model/obj';
import * as vertexbuffer from '../webgl/vertexbuffer';
import * as shader from '../webgl/shader';
import * as utils from '../webgl/utils';

export async function main() {
	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
	const gl = utils.initGL(canvas);

	gl.clearColor(0.1, 0.1, 0.1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const s = new shader.Shader(
		gl,
		await asset.loadText('/shader/light_vert.glsl'),
		await asset.loadText('/shader/light_frag.glsl'),
	);

	const m = obj.createModel(await asset.loadText('/model/cube.obj'));
	const b = new vertexbuffer.VertexBuffer(gl, m);

	const cam = new camera.Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		utils.resizeGL(gl);
		cam.setDimensions(gl.canvas.clientWidth, gl.canvas.clientHeight);

		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = math.mat4.create();
		math.mat4.identity(modelMatrix);
		math.mat4.rotateX(modelMatrix, modelMatrix, now * 1.3);
		math.mat4.rotateZ(modelMatrix, modelMatrix, now);
		math.mat4.rotateY(modelMatrix, modelMatrix, now * 0.7);

		const viewMatrix = cam.view();
		const projectionMatrix = cam.perspective();

		s.bind();
		s.setUniformMat4('uModel', modelMatrix);
		s.setUniformMat4('uView', viewMatrix);
		s.setUniformMat4('uProjection', projectionMatrix);
		s.setUniformVec3('uObjectColor', [1.0, 0.5, 0.31]);
		s.setUniformVec3('uLightPosition', [0, 2.0, 2.0]);
		s.setUniformVec3('uLightColor', [1.0, 1.0, 1.0]);
		s.setUniformVec3('uCameraPosition', cam.position);

		b.bind();
		gl.drawArrays(b.drawMode, 0, b.count);

		// continue draw loop
		requestAnimationFrame(draw);
	}
}
