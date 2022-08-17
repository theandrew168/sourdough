export enum VertexType {
	Position,
	Texcoord,
	Normal,
}

export type VertexComponent = {
	type: VertexType;
	size: 1 | 2 | 3 | 4;
};

export type VertexFormat = VertexComponent[];

export type VertexFormats = {
	P2F: VertexFormat;
	P3F: VertexFormat;
	P3F_T2F: VertexFormat;
	P3F_N3F: VertexFormat;
	P3F_T2F_N3F: VertexFormat;
};

export const VERTEX_FORMATS: VertexFormats = {
	P2F: [{ type: VertexType.Position, size: 2 }],
	P3F: [{ type: VertexType.Position, size: 3 }],
	P3F_T2F: [
		{ type: VertexType.Position, size: 3 },
		{ type: VertexType.Texcoord, size: 2 },
	],
	P3F_N3F: [
		{ type: VertexType.Position, size: 3 },
		{ type: VertexType.Normal, size: 3 },
	],
	P3F_T2F_N3F: [
		{ type: VertexType.Position, size: 3 },
		{ type: VertexType.Texcoord, size: 2 },
		{ type: VertexType.Normal, size: 3 },
	],
};

export function vertexFormatSize(format: VertexFormat): number {
	return format.reduce((sum, fmt) => sum + fmt.size, 0);
}

export function vertexFormatStride(format: VertexFormat): number {
	return vertexFormatSize(format) * 4;
}
