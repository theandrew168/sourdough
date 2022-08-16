import { ATTRIB_LOCATIONS } from "./attrib";

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

	public bind() {
		this.gl.useProgram(this.program);
	}

	public unbind() {
		this.gl.useProgram(null);
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