import * as math from 'gl-matrix';

import * as asset from '../asset';
import * as model from '../model';
import * as vertex from '../vertex';
import * as camera from '../camera';
import * as obj from '../loader/obj';
import * as vertexarray from '../webgl/vertexarray';
import * as shader from '../webgl/shader';
import * as texture from '../webgl/texture';
import * as utils from '../webgl/utils';
import * as cubemap from '../webgl/cubemap';

export async function main() {
	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
	const gl = utils.initGL(canvas);

	gl.clearColor(0.2, 0.3, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const s = new shader.Shader(
		gl,
		await asset.loadText('/app/skybox/box_vert.glsl'),
		await asset.loadText('/app/skybox/box_frag.glsl'),
	);

	const t = new texture.Texture(gl, await asset.loadImage('/app/skybox/box.png'));

	const m = obj.createModel(await asset.loadText('/model/cube.obj'));
	const v = new vertexarray.VertexArray(gl, m);

	const s2 = new shader.Shader(
		gl,
		await asset.loadText('/app/skybox/sky_vert.glsl'),
		await asset.loadText('/app/skybox/sky_frag.glsl'),
	);

	const images: cubemap.Images = {
		right: await asset.loadImage('/app/skybox/sky/right.jpg'),
		left: await asset.loadImage('/app/skybox/sky/left.jpg'),
		top: await asset.loadImage('/app/skybox/sky/top.jpg'),
		bottom: await asset.loadImage('/app/skybox/sky/bottom.jpg'),
		front: await asset.loadImage('/app/skybox/sky/front.jpg'),
		back: await asset.loadImage('/app/skybox/sky/back.jpg'),
	};
	const t2 = new cubemap.Cubemap(gl, images);

	const m2: model.Model = {
		drawMode: model.DrawMode.Triangles,
		format: [{ type: vertex.Type.Position, size: 2 }],
		// prettier-ignore
		vertices: new Float32Array([
			-1.0, -1.0,
			 1.0, -1.0,
		    -1.0,  1.0,
		    -1.0,  1.0,
			 1.0, -1.0,
			 1.0,  1.0,
		]),
	};
	const v2 = new vertexarray.VertexArray(gl, m2);

	const cam = new camera.Camera(gl.canvas.clientWidth, gl.canvas.clientHeight);

	let prevX = 0;
	let prevY = 0;
	canvas.addEventListener('touchstart', (ev) => {
		const touch = ev.touches[0];
		prevX = touch.clientX;
		prevY = touch.clientY;
	});
	canvas.addEventListener('touchmove', (ev) => {
		const touch = ev.touches[0];
		const curX = touch.clientX;
		const curY = touch.clientY;
		const deltaX = curX - prevX;
		const deltaY = curY - prevY;

		cam.adjustYaw(deltaX);
		cam.adjustPitch(deltaY);
		prevX = curX;
		prevY = curY;
	});

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

		const viewSky = math.mat4.clone(viewMatrix);
		viewSky[3] = 0;
		viewSky[7] = 0;
		viewSky[11] = 0;
		viewSky[12] = 0;
		viewSky[13] = 0;
		viewSky[14] = 0;

		const mvpSky = math.mat4.create();
		math.mat4.mul(mvpSky, projectionMatrix, viewSky);
		math.mat4.invert(mvpSky, mvpSky);

		t2.bind();
		s2.bind();
		s2.setUniformInt('uSampler', 0);
		s2.setUniformMat4('uMVP', mvpSky);
		v2.bind();
		v2.draw();
		v2.unbind();
		s2.unbind();
		t2.unbind();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = math.mat4.create();
		math.mat4.identity(modelMatrix);
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
		v.bind();
		v.draw();
		v.unbind();
		s.unbind();
		t.unbind();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}
