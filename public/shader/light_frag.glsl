#version 300 es
precision highp float;

in vec2 vTexCoord;
in vec3 vNormal;
in vec3 vWorldPosition;

out vec4 oFragColor;

uniform vec3 uObjectColor;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uCameraPosition;

void main() {
	float ambientStrength = 0.1;
	vec3 ambient = ambientStrength * uLightColor;

	vec3 norm = normalize(vNormal);
	vec3 lightDir = normalize(uLightPosition - vWorldPosition);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diff * uLightColor;

	float specularStrength = 0.5;
	vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
	vec3 specular = specularStrength * spec * uLightColor;

	vec3 result = (ambient + diffuse + specular) * uObjectColor;
	oFragColor = vec4(result, 1.0);
}
