import * as asset from '../asset';
import * as model from '../model';
import * as vertex from '../vertex';
import * as shader from '../webgl/shader';
import * as utils from '../webgl/utils';
import * as vertexarray from '../webgl/vertexarray';

export async function main() {
	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
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
		await asset.loadText('/app/triangle/triangle_vert.glsl'),
		await asset.loadText('/app/triangle/triangle_frag.glsl'),
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
