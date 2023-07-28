import * as math from "gl-matrix";

import * as asset from "../gfx/asset";
import * as camera from "../gfx/camera";
import * as obj from "../loader/obj";
import * as vertexarray from "../webgl/vertexarray";
import * as shader from "../webgl/shader";
import * as texture from "../webgl/texture";
import * as utils from "../webgl/utils";

export async function main(canvas: HTMLCanvasElement) {
	const gl = utils.initGL(canvas);

	gl.clearColor(0.1, 0.1, 0.1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const s = new shader.Shader(
		gl,
		await asset.loadText("/static/shader/metal_vert.glsl"),
		await asset.loadText("/static/shader/metal_frag.glsl"),
	);

	const tDiff = new texture.Texture(gl, await asset.loadImage("/static/texture/box_diffuse.png"));
	const tSpec = new texture.Texture(gl, await asset.loadImage("/static/texture/box_specular.png"));

	const m = obj.createModel(await asset.loadText("/static/model/cube.obj"));
	const v = new vertexarray.VertexArray(gl, m);

	const cam = new camera.Camera(canvas.clientWidth, canvas.clientHeight);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		// convert to seconds
		now *= 0.001;

		utils.resizeGL(gl);
		cam.setDimensions(canvas.clientWidth, canvas.clientHeight);

		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const modelMatrix = math.mat4.create();
		math.mat4.identity(modelMatrix);
		math.mat4.rotateY(modelMatrix, modelMatrix, now * 0.5);

		const viewMatrix = cam.view();
		const projectionMatrix = cam.perspective();

		gl.activeTexture(gl.TEXTURE0);
		tDiff.bind();

		gl.activeTexture(gl.TEXTURE1);
		tSpec.bind();

		s.bind();

		s.setUniformMat4("uModel", modelMatrix);
		s.setUniformMat4("uView", viewMatrix);
		s.setUniformMat4("uProjection", projectionMatrix);
		s.setUniformVec3("uCameraPosition", cam.position);

		s.setUniformInt("uMaterial.diffuse", 0);
		s.setUniformInt("uMaterial.specular", 1);
		s.setUniformFloat("uMaterial.shininess", 32.0);

		s.setUniformVec3("uLight.position", [0.0, 0.0, 4.0]);
		s.setUniformVec3("uLight.ambient", [0.2, 0.2, 0.2]);
		s.setUniformVec3("uLight.diffuse", [0.5, 0.5, 0.5]);
		s.setUniformVec3("uLight.specular", [1.0, 1.0, 1.0]);

		v.bind();
		v.draw();

		// continue draw loop
		requestAnimationFrame(draw);
	}
}
