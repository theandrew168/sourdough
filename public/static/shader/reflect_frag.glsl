#version 300 es
precision highp float;

in vec3 vWorldPosition;
in vec3 vWorldNormal;

out vec4 oFragColor;

uniform vec3 uCameraPosition;
uniform samplerCube uTexture;

void main() {
	vec3 worldNormal = normalize(vWorldNormal);
	vec3 eyeToSurfaceDir = normalize(vWorldPosition - uCameraPosition);
	vec3 direction = reflect(eyeToSurfaceDir, worldNormal);

	oFragColor = texture(uTexture, direction);
}
