export enum VertexComponent {
	Position,
	Texcoord,
	Normal,
}

export type VertexFormat = {
	component: VertexComponent;
	size: 1 | 2 | 3 | 4;
};

export type VertexFormats = {
	P2F: VertexFormat[];
	P3F: VertexFormat[];
	P3F_T2F: VertexFormat[];
	P3F_N3F: VertexFormat[];
	P3F_T2F_N3F: VertexFormat[];
};

export const VERTEX_FORMATS: VertexFormats = {
	P2F: [{ component: VertexComponent.Position, size: 2 }],
	P3F: [{ component: VertexComponent.Position, size: 3 }],
	P3F_T2F: [
		{ component: VertexComponent.Position, size: 3 },
		{ component: VertexComponent.Texcoord, size: 2 },
	],
	P3F_N3F: [
		{ component: VertexComponent.Position, size: 3 },
		{ component: VertexComponent.Normal, size: 3 },
	],
	P3F_T2F_N3F: [
		{ component: VertexComponent.Position, size: 3 },
		{ component: VertexComponent.Texcoord, size: 2 },
		{ component: VertexComponent.Normal, size: 3 },
	],
};
