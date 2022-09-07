#version 300 es

in vec4 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat4 uMVP;

void main() {
	vTexCoord = aTexCoord;
	gl_Position = uMVP * aPosition;
}
