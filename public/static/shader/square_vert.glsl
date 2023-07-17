#version 300 es

in vec4 aPosition;
in vec4 aColor;

out vec4 vColor;

uniform mat4 uMVP;

void main() {
	vColor = aColor;
	gl_Position = uMVP * aPosition;
}
