import * as math from "gl-matrix";

import * as attrib from "./attrib";

export class Shader {
	private gl: WebGL2RenderingContext;
	private program: WebGLProgram;

	constructor(gl: WebGL2RenderingContext, vertSource: string, fragSource: string) {
		this.gl = gl;

		const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER)!;
		this.compileShader(vertShader, vertSource);

		const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
		this.compileShader(fragShader, fragSource);

		this.program = this.gl.createProgram()!;
		Object.values(attrib.LOCATIONS).forEach((value) => {
			this.gl.bindAttribLocation(this.program, value.location, value.attrib);
		});

		this.linkProgram(this.program, vertShader, fragShader);

		this.gl.deleteShader(vertShader);
		this.gl.deleteShader(fragShader);
	}

	public bind() {
		this.gl.useProgram(this.program);
	}

	public unbind() {
		this.gl.useProgram(null);
	}

	public destroy() {
		this.gl.deleteProgram(this.program);
	}

	public setUniformInt(name: string, value: number) {
		const location = this.getUniformLocation(name);
		this.gl.uniform1i(location, value);
	}

	public setUniformFloat(name: string, value: number) {
		const location = this.getUniformLocation(name);
		this.gl.uniform1f(location, value);
	}

	public setUniformVec3(name: string, value: math.vec3) {
		const location = this.getUniformLocation(name);
		this.gl.uniform3fv(location, value);
	}

	public setUniformMat4(name: string, value: math.mat4) {
		const location = this.getUniformLocation(name);
		this.gl.uniformMatrix4fv(location, false, value);
	}

	private getUniformLocation(name: string): WebGLUniformLocation {
		// TODO: cache this?
		const location = this.gl.getUniformLocation(this.program, name);
		if (!location) {
			throw new Error(`invalid uniform location: ${name}`);
		}

		return location;
	}

	private compileShader(shader: WebGLShader, source: string) {
		this.gl.shaderSource(shader, source);

		this.gl.compileShader(shader);
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw this.gl.getShaderInfoLog(shader);
		}
	}

	private linkProgram(program: WebGLProgram, vertShader: WebGLShader, fragShader: WebGLShader) {
		this.gl.attachShader(program, vertShader);
		this.gl.attachShader(program, fragShader);

		this.gl.linkProgram(program);
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			throw this.gl.getProgramInfoLog(program);
		}

		this.gl.detachShader(program, vertShader);
		this.gl.detachShader(program, fragShader);
	}
}
