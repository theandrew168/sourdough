import { AttribLocation } from './attrib.js';

export class Shader {
	constructor(gl, vertSource, fragSource) {
		this.gl = gl;

		const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.#compileShader(vertShader, vertSource);

		const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.#compileShader(fragShader, fragSource);

		this.program = this.gl.createProgram();
		Object.keys(AttribLocation).map((key) => {
			const attrib = AttribLocation[key];
			this.gl.bindAttribLocation(this.program, attrib.location, attrib.name);
		});

		this.#linkProgram(this.program, vertShader, fragShader);

		this.gl.deleteShader(vertShader);
		this.gl.deleteShader(fragShader);
	}

	static async fromPath(gl, vertPath, fragPath) {
		const vertSourceResp = await fetch(vertPath);
		const vertSource = await vertSourceResp.text();

		const fragSourceResp = await fetch(fragPath);
		const fragSource = await fragSourceResp.text();

		const shader = new Shader(gl, vertSource, fragSource);
		return shader;
	}

	bind() {
		this.gl.useProgram(this.program);
	}

	unbind() {
		this.gl.useProgram(null);
	}

	destroy() {
		this.gl.deleteProgram(this.program);
	}

	#compileShader(shader, source) {
		this.gl.shaderSource(shader, source);

		this.gl.compileShader(shader);
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			throw this.gl.getShaderInfoLog(shader);
		}
	}

	#linkProgram(program, vertShader, fragShader) {
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
