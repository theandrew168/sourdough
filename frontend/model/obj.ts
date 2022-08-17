import { Model } from '../model';
import { VertexFormat, VertexType } from '../vertexformat';

export function readOBJ(source: string): Model {
	let positionSize = 0;
	let texcoordSize = 0;
	let normalSize = 0;

	const positions: string[][] = [];
	const texcoords: string[][] = [];
	const normals: string[][] = [];
	const faces: string[] = [];

	// build arrays for each component
	const lines: string[] = source.split(/\r?\n/);
	lines.forEach((line) => {
		const tokens = line.trim().split(/\s+/);
		const marker = tokens[0];
		const values = tokens.slice(1);
		switch (marker) {
			case 'v':
				positionSize = values.length;
				positions.push(values);
				break;
			case 'vt':
				texcoordSize = values.length;
				texcoords.push(values);
				break;
			case 'vn':
				normalSize = values.length;
				normals.push(values);
				break;
			case 'f':
				faces.push(...values);
				break;
		}
	});

	// flatten components based on face indices
	const vertices: string[] = [];
	faces.forEach((face) => {
		const indices = face.split('/');
		if (indices.length === 1) {
			// position
			const positionIndex = Number(indices[0]) - 1;
			vertices.push(...positions[positionIndex]);
		} else if (indices.length === 2) {
			// position + texcoord
			const positionIndex = Number(indices[0]) - 1;
			vertices.push(...positions[positionIndex]);

			const texcoordIndex = Number(indices[1]) - 1;
			vertices.push(...texcoords[texcoordIndex]);
		} else if (indices.length === 3) {
			// position + texcoord? + normal
			const positionIndex = Number(indices[0]) - 1;
			vertices.push(...positions[positionIndex]);

			const texcoordIndex = Number(indices[1]) - 1;
			if (texcoordIndex !== 0) {
				vertices.push(...texcoords[texcoordIndex]);
			}

			const normalIndex = Number(indices[2]) - 1;
			vertices.push(...normals[normalIndex]);
		}
	});

	// determine format
	let format: VertexFormat = [];
	if (positionSize === 2) {
		format.push({ type: VertexType.Position, size: 2 });
	}
	if (positionSize === 3) {
		format.push({ type: VertexType.Position, size: 3 });
	}
	if (texcoordSize === 2) {
		format.push({ type: VertexType.Texcoord, size: 2 });
	}
	if (normalSize === 3) {
		format.push({ type: VertexType.Normal, size: 3 });
	}

	const model: Model = {
		format: format,
		vertices: Float32Array.from(vertices.map((v) => Number(v))),
	};

	return model;
}
