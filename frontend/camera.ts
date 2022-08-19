import * as math from 'gl-matrix';

export class Camera {
	private width: number;
	private height: number;
	private near: number;
	private far: number;
	private fov: number;

	private position: math.vec3;
	private front: math.vec3;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.near = 0.1;
		this.far = 100;
		this.fov = 45;

		this.position = math.vec3.fromValues(0, 0, 6);
		this.front = math.vec3.fromValues(0, 0, -1);
	}

	public setDimensions(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public view(): math.mat4 {
		const eye = math.vec3.clone(this.position);

		const center = math.vec3.create();
		math.vec3.add(center, this.position, this.front);

		const up = math.vec3.fromValues(0, 1, 0);

		const view = math.mat4.create();
		math.mat4.lookAt(view, eye, center, up);
		return view;
	}

	public perspective(): math.mat4 {
		// convert fov to radians
		const fov = (this.fov * Math.PI) / 180.0;
		const aspect = this.width / this.height;

		const perspective = math.mat4.create();
		math.mat4.perspective(perspective, fov, aspect, this.near, this.far);
		return perspective;
	}

	public orthographic(): math.mat4 {
		const aspect = this.width / this.height;

		const orthographic = math.mat4.create();
		math.mat4.ortho(orthographic, -aspect, aspect, -1, 1, this.near, this.far);
		return orthographic;
	}
}
