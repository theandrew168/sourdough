import * as vertex from './vertex';

export enum DrawMode {
	Triangles,
	TriangleStrip,
}

export type Model = {
	drawMode: DrawMode;
	format: vertex.VertexComponent[];
	vertices: Float32Array;
};
