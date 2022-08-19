import * as vertex from '../vertex';

export type Location = {
	attrib: string;
	location: number;
};

export type Locations = Record<vertex.VertexType, Location>;

export const LOCATIONS: Locations = {
	[vertex.VertexType.Position]: {
		attrib: 'aPosition',
		location: 0,
	},
	[vertex.VertexType.TexCoord]: {
		attrib: 'aTexCoord',
		location: 1,
	},
	[vertex.VertexType.Normal]: {
		attrib: 'aNormal',
		location: 2,
	},
	[vertex.VertexType.Color]: {
		attrib: 'aColor',
		location: 3,
	},
};
