import * as math from "gl-matrix";

export class Camera {
	private width: number;
	private height: number;
	private near: number;
	private far: number;
	private fov: number;
	private pitch: number;
	private yaw: number;

	public position: math.vec3;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.near = 0.1;
		this.far = 100;
		this.fov = 45;
		this.yaw = -90.0;
		this.pitch = 0.0;

		this.position = math.vec3.fromValues(0, 0, 10);
	}

	public setDimensions(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public adjustYaw(offset: number) {
		this.yaw += offset;
	}

	public adjustPitch(offset: number) {
		this.pitch -= offset;
		if (this.pitch >= 89.0) this.pitch = 89.0;
		if (this.pitch <= -89.0) this.pitch = -89.0;
	}

	public view(): math.mat4 {
		const front = math.vec3.fromValues(
			Math.cos(rads(this.yaw)) * Math.cos(rads(this.pitch)),
			Math.sin(rads(this.pitch)),
			Math.sin(rads(this.yaw)) * Math.cos(rads(this.pitch)),
		);

		// where is the camera located
		const eye = math.vec3.clone(this.position);

		// where / what is the camera looking at
		const center = math.vec3.create();
		math.vec3.add(center, this.position, front);

		// what direction is up
		const up = math.vec3.fromValues(0, 1, 0);

		const view = math.mat4.create();
		math.mat4.lookAt(view, eye, center, up);
		return view;
	}

	public perspective(): math.mat4 {
		const fov = rads(this.fov);
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

function rads(degs: number): number {
	return degs * (Math.PI / 180.0);
}
