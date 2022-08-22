import * as math from 'gl-matrix';

import * as asset from '../asset';
import * as camera from '../camera';
import * as model from '../model';
import * as vertex from '../vertex';
import * as shader from '../webgl/shader';
import * as utils from '../webgl/utils';
import * as vertexbuffer from '../webgl/vertexbuffer';

export async function main() {
	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
	const gl = utils.initGL(canvas);

	const m: model.Model = {
		drawMode: model.DrawMode.TriangleStrip,
		format: [
			{ type: vertex.Type.Position, size: 2 },
			{ type: vertex.Type.Color, size: 4 },
		],
		// prettier-ignore
		vertices: new Float32Array([
			 0.5,  0.5,
			 1.0,  1.0,  1.0,  1.0, // white
			-0.5,  0.5,
			 1.0,  0.0,  0.0,  1.0, // red
			 0.5, -0.5,
			 0.0,  1.0,  0.0,  1.0, // green
			-0.5, -0.5,
			 0.0,  0.0,  1.0,  1.0, // blue
		]),
	};
	const b = new vertexbuffer.VertexBuffer(gl, m);
	console.log(b);

	const s = new shader.Shader(
		gl,
		await asset.loadText('/shader/square_vert.glsl'),
		await asset.loadText('/shader/square_frag.glsl'),
	);

	const cam = new camera.Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		utils.resizeGL(gl);
		cam.setDimensions(gl.canvas.clientWidth, gl.canvas.clientHeight);

		gl.clearColor(0.2, 0.3, 0.4, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const modelMatrix = math.mat4.create();
		math.mat4.identity(modelMatrix);
		math.mat4.translate(modelMatrix, modelMatrix, [0, 0, -4]);
		math.mat4.rotateZ(modelMatrix, modelMatrix, now);

		const projectionMatrix = cam.perspective();

		const mvpMatrix = math.mat4.create();
		math.mat4.multiply(mvpMatrix, projectionMatrix, modelMatrix);

		s.bind();
		s.setUniformMat4('uMVP', mvpMatrix);
		b.bind();
		gl.drawArrays(b.drawMode, 0, b.count);

		requestAnimationFrame(draw);
	}
}
