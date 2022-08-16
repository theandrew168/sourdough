export type AttribLocation = {
	attrib: string;
	location: number;
};

export type AttribLocations = {
	position: AttribLocation;
	texcoord: AttribLocation;
	normal: AttribLocation;
};

export const ATTRIB_LOCATIONS: AttribLocations = {
	position: {
		attrib: 'i_position',
		location: 0,
	},
	texcoord: {
		attrib: 'i_texcoord',
		location: 1,
	},
	normal: {
		attrib: 'i_normal',
		location: 2,
	},
};
