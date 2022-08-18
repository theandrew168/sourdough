import { DrawMode, Model } from '../model';
import { VertexType } from '../vertexformat';

export function readMD5(source: string): Model {
	const model: Model = {
		drawMode: DrawMode.Triangles,
		format: [{ type: VertexType.Position, size: 2 }],
		vertices: new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]),
	};

	return model;
}
