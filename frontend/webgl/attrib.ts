import { VertexComponent } from './vertexformat';

export type AttribLocation = {
	attrib: string;
	location: number;
};

export type AttribLocations = Record<VertexComponent, AttribLocation>;

export const ATTRIB_LOCATIONS: AttribLocations = {
	[VertexComponent.Position]: {
		attrib: 'i_position',
		location: 0,
	},
	[VertexComponent.Texcoord]: {
		attrib: 'i_texcoord',
		location: 1,
	},
	[VertexComponent.Normal]: {
		attrib: 'i_normal',
		location: 2,
	},
};
