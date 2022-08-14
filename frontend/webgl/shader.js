export class Shader {
	constructor(gl, vertSource, fragSource) {
		this.gl = gl;
		this.program = this.#compileAndLinkProgram(vertSource, fragSource);
	}

	static async fromPath(gl, vertPath, fragPath) {
		const vertSourceResp = await fetch(vertPath);
		const vertSource = await vertSourceResp.text();

		const fragSourceResp = await fetch(fragPath);
		const fragSource = await fragSourceResp.text();

		const s = new Shader(gl, vertSource, fragSource);
		return s;
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

	#compileAndLinkProgram(vertSource, fragSource) {
		const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
		this.#compileShader(vertShader, vertSource);

		const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		this.#compileShader(fragShader, fragSource);

		const program = this.gl.createProgram();
		this.#linkProgram(program, vertShader, fragShader);

		this.gl.deleteShader(vertShader);
		this.gl.deleteShader(fragShader);

		return program;
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
