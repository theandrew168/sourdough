import * as asset from '../asset';
import * as model from '../model';
import * as vertex from '../vertex';
import * as shader from '../webgl/shader';
import * as utils from '../webgl/utils';
import * as vertexbuffer from '../webgl/vertexbuffer';

export async function main() {
	const canvas = document.querySelector('#glCanvas') as HTMLCanvasElement;
	const gl = utils.initGL(canvas);

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
	const b = new vertexbuffer.VertexBuffer(gl, m);

	const s = new shader.Shader(
		gl,
		await asset.loadText('/shader/triangle_vert.glsl'),
		await asset.loadText('/shader/triangle_frag.glsl'),
	);

	requestAnimationFrame(draw);
	function draw(now: DOMHighResTimeStamp) {
		utils.resizeGL(gl);
		gl.clearColor(0.2, 0.3, 0.4, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		s.bind();
		b.bind();
		gl.drawArrays(b.drawMode, 0, b.count);

		requestAnimationFrame(draw);
	}
}
