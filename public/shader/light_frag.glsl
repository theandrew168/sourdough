#version 300 es
precision highp float;

in vec2 vTexCoord;
in vec3 vNormal;
in vec3 vWorldPosition;

out vec4 oFragColor;

uniform vec3 uObjectColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;

void main() {
	float ambientStrength = 0.1;
	vec3 ambient = ambientStrength * uLightColor;

	vec3 norm = normalize(vNormal);
	vec3 lightDir = normalize(uLightPosition - vWorldPosition);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diff * uLightColor;

	vec3 result = (ambient + diffuse) * uObjectColor;
	oFragColor = vec4(result, 1.0);
}
