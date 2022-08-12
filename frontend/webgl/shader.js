export class Shader {
	constructor(gl, vertSource, fragSource) {
		this.gl = gl;

		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		this.#compileShader(vertShader, vertSource);

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		this.#compileShader(fragShader, fragSource);

		this.program = gl.createProgram();
		this.#linkProgram(this.program, vertShader, fragShader);

		gl.deleteShader(vertShader);
		gl.deleteShader(fragShader);
	}

	bind() {
		this.gl.useProgram(this.program);
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
