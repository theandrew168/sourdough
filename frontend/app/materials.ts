import * as math from "gl-matrix";

import * as asset from "../gfx/asset";
import * as camera from "../gfx/camera";
import * as obj from "../loader/obj";
import * as vertexarray from "../webgl/vertexarray";
import * as shader from "../webgl/shader";
import * as utils from "../webgl/utils";
import { BASIC_MATERIALS, EMERALD, type BasicMaterial } from "../gfx/material";

export async function main(gl: WebGL2RenderingContextStrict) {
	gl.clearColor(0.1, 0.1, 0.1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const s = new shader.Shader(
		gl,
		await asset.loadText("/static/shader/materials_vert.glsl"),
		await asset.loadText("/static/shader/materials_frag.glsl"),
	);

	const m = obj.createModel(await asset.loadText("/static/model/cube.obj"));
	const v = new vertexarray.VertexArray(gl, m);

	// cycle materials upon touch
	const mats = Object.keys(BASIC_MATERIALS);

	let idx = 0;
	let cur = mats[idx] ?? "";
	let mat: BasicMaterial = BASIC_MATERIALS[cur] ?? EMERALD;
	console.log(cur);

	const cycle = () => {
		idx = (idx + 1) % mats.length;
		cur = mats[idx] ?? "";
		mat = BASIC_MATERIALS[cur] ?? EMERALD;
		console.log(cur);
	};

	gl.canvas.addEventListener("mousedown", (ev) => cycle());

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

		s.setUniformMat4("uModel", modelMatrix);
		s.setUniformMat4("uView", viewMatrix);
		s.setUniformMat4("uProjection", projectionMatrix);
		s.setUniformVec3("uCameraPosition", cam.position);

		s.setUniformVec3("uMaterial.ambient", mat.ambient);
		s.setUniformVec3("uMaterial.diffuse", mat.diffuse);
		s.setUniformVec3("uMaterial.specular", mat.specular);
		s.setUniformFloat("uMaterial.shininess", mat.shininess);

		s.setUniformVec3("uLight.position", [0, 2.0, 2.0]);
		s.setUniformVec3("uLight.ambient", [0.2, 0.2, 0.2]);
		s.setUniformVec3("uLight.diffuse", [0.5, 0.5, 0.5]);
		s.setUniformVec3("uLight.specular", [1.0, 1.0, 1.0]);

		v.bind();
		v.draw();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}
