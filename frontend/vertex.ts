export enum Type {
	Position,
	TexCoord,
	Normal,
	Color,
}

export type Size = 1 | 2 | 3 | 4;

export function size(size: number): Size {
	const valid = size in [1, 2, 3, 4];
	if (!valid) {
		throw new Error(`invalid VertexSize: ${size}`);
	}
	return size as Size;
}

// this assumes that the primitive type is always a 32-bit float
export type Component = {
	type: Type;
	size: Size;
};

export type Format = Component[];

export function formatSize(format: Format): number {
	return format.reduce((sum, fmt) => sum + fmt.size, 0);
}

export function formatStride(format: Format): number {
	return formatSize(format) * 4;
}
