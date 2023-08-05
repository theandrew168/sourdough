import React, { useEffect, useRef } from "react";
import * as math from "gl-matrix";

import * as asset from "../gfx/asset";
import * as model from "../gfx/model";
import * as vertex from "../gfx/vertex";
import * as camera from "../gfx/camera";
import * as obj from "../loader/obj";
import * as vertexarray from "../webgl/vertexarray";
import * as shader from "../webgl/shader";
import * as utils from "../webgl/utils";
import * as cubemap from "../webgl/cubemap";

async function main(canvas: HTMLCanvasElement) {
	const gl = utils.initGL(canvas);

	gl.clearColor(0.2, 0.3, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const s = new shader.Shader(
		gl,
		await asset.loadText("/static/shader/reflect_vert.glsl"),
		await asset.loadText("/static/shader/reflect_frag.glsl"),
	);

	const m = obj.createModel(await asset.loadText("/static/model/cube.obj"));
	const v = new vertexarray.VertexArray(gl, m);

	const s2 = new shader.Shader(
		gl,
		await asset.loadText("/static/shader/sky_vert.glsl"),
		await asset.loadText("/static/shader/sky_frag.glsl"),
	);

	const [right, left, top, bottom, front, back] = await Promise.all([
		asset.loadImage("/static/texture/sky/right.jpg"),
		asset.loadImage("/static/texture/sky/left.jpg"),
		asset.loadImage("/static/texture/sky/top.jpg"),
		asset.loadImage("/static/texture/sky/bottom.jpg"),
		asset.loadImage("/static/texture/sky/front.jpg"),
		asset.loadImage("/static/texture/sky/back.jpg"),
	]);
	const images: cubemap.Images = { right, left, top, bottom, front, back };
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

	const cam = new camera.Camera(canvas.clientWidth, canvas.clientHeight);

	let prevX = 0;
	let prevY = 0;
	canvas.addEventListener("touchstart", (ev) => {
		const touch = ev.touches[0];
		if (!touch) {
			return;
		}

		prevX = touch.clientX;
		prevY = touch.clientY;
	});
	canvas.addEventListener("touchmove", (ev) => {
		const touch = ev.touches[0];
		if (!touch) {
			return;
		}

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
		cam.setDimensions(canvas.clientWidth, canvas.clientHeight);

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
		s2.setUniformInt("uTexture", 0);
		s2.setUniformMat4("uMVP", mvpSky);
		v2.bind();
		v2.draw();
		v2.unbind();
		s2.unbind();
		t2.unbind();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		const modelMatrix = math.mat4.create();
		math.mat4.identity(modelMatrix);
		math.mat4.rotateY(modelMatrix, modelMatrix, now * 0.7);
		math.mat4.rotateX(modelMatrix, modelMatrix, now * 0.3);

		t2.bind();
		s.bind();
		s.setUniformInt("uTexture", 0);
		s.setUniformVec3("uCameraPosition", cam.position);
		s.setUniformMat4("uModel", modelMatrix);
		s.setUniformMat4("uView", viewMatrix);
		s.setUniformMat4("uProjection", projectionMatrix);
		v.bind();
		v.draw();
		v.unbind();
		s.unbind();
		t2.unbind();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}

export function App() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			throw new Error("Failed to find canvas.");
		}

		main(canvas);
	}, []);

	return <canvas className="h-full w-full" ref={canvasRef}></canvas>;
}
