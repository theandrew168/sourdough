import * as model from "../gfx/model";
import * as vertex from "../gfx/vertex";

export function readMD5(source: string): model.Model {
	const m: model.Model = {
		drawMode: model.DrawMode.Triangles,
		format: [{ type: vertex.Type.Position, size: 2 }],
		vertices: new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]),
	};

	return m;
}
