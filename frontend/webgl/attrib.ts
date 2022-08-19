import * as vertex from '../vertex';

export type Location = {
	attrib: string;
	location: number;
};

export type Locations = Record<vertex.Type, Location>;

export const LOCATIONS: Locations = {
	[vertex.Type.Position]: {
		attrib: 'aPosition',
		location: 0,
	},
	[vertex.Type.TexCoord]: {
		attrib: 'aTexCoord',
		location: 1,
	},
	[vertex.Type.Normal]: {
		attrib: 'aNormal',
		location: 2,
	},
	[vertex.Type.Color]: {
		attrib: 'aColor',
		location: 3,
	},
};
