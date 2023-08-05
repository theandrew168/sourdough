import React, { useEffect, useRef } from "react";

import * as asset from "../gfx/asset";
import * as model from "../gfx/model";
import * as vertex from "../gfx/vertex";
import * as shader from "../webgl/shader";
import * as utils from "../webgl/utils";
import * as vertexarray from "../webgl/vertexarray";

async function main(canvas: HTMLCanvasElement) {
	const gl = utils.initGL(canvas);

	gl.clearColor(0.2, 0.3, 0.4, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const m: model.Model = {
		drawMode: model.DrawMode.Triangles,
		format: [{ type: vertex.Type.Position, size: 3 }],
		// prettier-ignore
		vertices: new Float32Array([
			-0.5, -0.5,  0.0,
			 0.5, -0.5,  0.0,
			 0.0,  0.5,  0.0,
		]),
	};
	const v = new vertexarray.VertexArray(gl, m);

	const s = new shader.Shader(
		gl,
		await asset.loadText("/static/shader/triangle_vert.glsl"),
		await asset.loadText("/static/shader/triangle_frag.glsl"),
	);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		utils.resizeGL(gl);
		gl.clearColor(0.2, 0.3, 0.4, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		s.bind();
		v.bind();
		v.draw();

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
