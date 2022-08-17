import { Model } from '../model';
import { VERTEX_FORMATS } from '../vertexformat';

export function readMD5(source: string): Model {
	const model: Model = {
		format: VERTEX_FORMATS.P2F,
		vertices: new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]),
	};

	return model;
}
