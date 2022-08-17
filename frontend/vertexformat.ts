export enum VertexType {
	Position,
	Texcoord,
	Normal,
	Color,
}

export type VertexSize = 1 | 2 | 3 | 4;

export function toVertexSize(size: number): VertexSize {
	const valid = size in [1, 2, 3, 4];
	if (!valid) {
		throw new Error(`invalid VertexSize: ${size}`);
	}
	return size as VertexSize;
}

// this assumes that the primitive type is always a 32-bit float
export type VertexComponent = {
	type: VertexType;
	size: VertexSize;
};

export type VertexFormat = VertexComponent[];

export function vertexFormatSize(format: VertexFormat): number {
	return format.reduce((sum, fmt) => sum + fmt.size, 0);
}

export function vertexFormatStride(format: VertexFormat): number {
	return vertexFormatSize(format) * 4;
}
