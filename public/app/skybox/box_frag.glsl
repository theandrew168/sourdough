#version 300 es
precision highp float;

in vec2 vTexCoord;

out vec4 oFragColor;

uniform sampler2D uSampler;

void main() {
	oFragColor = texture(uSampler, vTexCoord);
}
