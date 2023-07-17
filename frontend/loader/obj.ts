import * as model from "../gfx/model";
import * as vertex from "../gfx/vertex";

export function createModel(source: string): model.Model {
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
			case "v":
				positionSize = values.length;
				positions.push(values);
				break;
			case "vt":
				texcoordSize = values.length;
				texcoords.push(values);
				break;
			case "vn":
				normalSize = values.length;
				normals.push(values);
				break;
			case "f":
				faces.push(...values);
				break;
		}
	});

	// flatten components based on face indices
	const vertices: string[] = [];
	faces.forEach((face) => {
		const indices = face.split("/");
		if (indices.length === 1) {
			// position
			const positionIndex = Number(indices[0]);
			vertices.push(...(positions[positionIndex - 1] ?? []));
		} else if (indices.length === 2) {
			// position + texcoord
			const positionIndex = Number(indices[0]);
			vertices.push(...(positions[positionIndex - 1] ?? []));

			const texcoordIndex = Number(indices[1]);
			vertices.push(...(texcoords[texcoordIndex - 1] ?? []));
		} else if (indices.length === 3) {
			// position + texcoord? + normal
			const positionIndex = Number(indices[0]);
			vertices.push(...(positions[positionIndex - 1] ?? []));

			// this check works because Number('') === 0 and no
			// obj indices will be zero (they are one-based)
			const texcoordIndex = Number(indices[1]);
			if (texcoordIndex !== 0) {
				vertices.push(...(texcoords[texcoordIndex - 1] ?? []));
			}

			const normalIndex = Number(indices[2]) - 1;
			vertices.push(...(normals[normalIndex] ?? []));
		}
	});

	// determine format
	let format: vertex.Format = [];
	format.push({ type: vertex.Type.Position, size: vertex.size(positionSize) });
	if (texcoordSize !== 0) {
		format.push({ type: vertex.Type.TexCoord, size: vertex.size(texcoordSize) });
	}
	if (normalSize !== 0) {
		format.push({ type: vertex.Type.Normal, size: vertex.size(normalSize) });
	}

	const m: model.Model = {
		drawMode: model.DrawMode.Triangles,
		format: format,
		vertices: Float32Array.from(vertices.map((v) => Number(v))),
	};
	return m;
}
