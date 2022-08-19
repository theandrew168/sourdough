#version 300 es
precision highp float;

in vec3 vTexCoord;

out vec4 oFragColor;

uniform samplerCube uSampler;

void main() {
	oFragColor = texture(uSampler, vTexCoord);
}
