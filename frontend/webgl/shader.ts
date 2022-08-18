import { mat4 } from 'gl-matrix';

import { ATTRIB_LOCATIONS } from './attrib';

export class Shader {
	private gl: WebGL2RenderingContextStrict;
	private program: WebGLProgram;

	constructor(gl: WebGL2RenderingContextStrict, vertSource: string, fragSource: string) {
		this.gl = gl;

		const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER)!;
		this.compileShader(vertShader, vertSource);

		const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
		this.compileShader(fragShader, fragSource);

		this.program = this.gl.createProgram()!;
		Object.values(ATTRIB_LOCATIONS).forEach((value) => {
			this.gl.bindAttribLocation(this.program, value.location, value.attrib);
		});

		this.linkProgram(this.program, vertShader, fragShader);

		this.gl.deleteShader(vertShader);
		this.gl.deleteShader(fragShader);
	}

	static async fromPath(gl: WebGL2RenderingContextStrict, vertPath: string, fragPath: string) {
		const vertSourceResp = await fetch(vertPath);
		const vertSource = await vertSourceResp.text();

		const fragSourceResp = await fetch(fragPath);
		const fragSource = await fragSourceResp.text();

		const shader = new Shader(gl, vertSource, fragSource);
		return shader;
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

	public setUniformMat4(name: string, value: mat4) {
		// TODO: cache this?
		const location = this.gl.getUniformLocation(this.program, name);
		if (!location) {
			throw new Error(`invalid uniform location: ${name}`);
		}

		this.gl.uniformMatrix4fv(location, false, value);
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
