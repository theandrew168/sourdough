#version 300 es
precision highp float;

in vec2 vTexCoord;

out vec4 oFragColor;

uniform sampler2D uTexture;

void main() {
	oFragColor = texture(uTexture, vTexCoord);
}
