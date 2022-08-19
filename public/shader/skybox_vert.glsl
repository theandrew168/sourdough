#version 300 es

in vec4 aPosition;

out vec3 vTexCoord;

uniform mat4 uMVP;

void main() {
	vTexCoord = aPosition.xyz;
	gl_Position = uMVP * aPosition;
}
