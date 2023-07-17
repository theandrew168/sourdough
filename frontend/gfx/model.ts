import * as vertex from "./vertex";

export enum DrawMode {
	Triangles,
	TriangleStrip,
}

export type Model = {
	drawMode: DrawMode;
	format: vertex.Format;
	vertices: Float32Array;
	indices?: Uint16Array;
};
