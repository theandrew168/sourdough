import { VertexType } from '../vertexformat';

export type AttribLocation = {
	attrib: string;
	location: number;
};

export type AttribLocations = Record<VertexType, AttribLocation>;

export const ATTRIB_LOCATIONS: AttribLocations = {
	[VertexType.Position]: {
		attrib: 'i_position',
		location: 0,
	},
	[VertexType.Texcoord]: {
		attrib: 'i_texcoord',
		location: 1,
	},
	[VertexType.Normal]: {
		attrib: 'i_normal',
		location: 2,
	},
};
