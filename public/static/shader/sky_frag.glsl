#version 300 es
precision highp float;

in vec4 vPosition;

out vec4 oFragColor;

uniform samplerCube uTexture;
uniform mat4 uMVP;

void main() {
	vec4 t = uMVP * vPosition;
	oFragColor = texture(uTexture, normalize(t.xyz / t.w));
}
