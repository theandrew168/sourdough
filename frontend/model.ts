import { VertexComponent } from './vertexformat';

export enum DrawMode {
	Triangles,
	TriangleStrip,
}

export type Model = {
	drawMode: DrawMode;
	format: VertexComponent[];
	vertices: Float32Array;
};
