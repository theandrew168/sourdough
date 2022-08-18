import { VertexType } from '../vertexformat';

export type AttribLocation = {
	attrib: string;
	location: number;
};

export type AttribLocations = Record<VertexType, AttribLocation>;

export const ATTRIB_LOCATIONS: AttribLocations = {
	[VertexType.Position]: {
		attrib: 'aPosition',
		location: 0,
	},
	[VertexType.TexCoord]: {
		attrib: 'aTexCoord',
		location: 1,
	},
	[VertexType.Normal]: {
		attrib: 'aNormal',
		location: 2,
	},
	[VertexType.Color]: {
		attrib: 'aColor',
		location: 3,
	},
};
