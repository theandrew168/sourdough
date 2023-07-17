import * as asset from "../gfx/asset";
import * as model from "../gfx/model";
import * as vertex from "../gfx/vertex";
import * as shader from "../webgl/shader";
import * as utils from "../webgl/utils";
import * as vertexarray from "../webgl/vertexarray";

export async function main(gl: WebGL2RenderingContextStrict) {
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
