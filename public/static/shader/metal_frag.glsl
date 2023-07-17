#version 300 es
precision highp float;

struct Material {
	sampler2D diffuse;
	sampler2D specular;
	float shininess;
};

struct Light {
    vec3 position;
  
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec2 vTexCoord;
in vec3 vNormal;
in vec3 vWorldPosition;

out vec4 oFragColor;

uniform vec3 uCameraPosition;
uniform Material uMaterial;
uniform Light uLight;

void main() {
	vec3 ambient = uLight.ambient * vec3(texture(uMaterial.diffuse, vTexCoord));

	vec3 norm = normalize(vNormal);
	vec3 lightDir = normalize(uLight.position - vWorldPosition);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = uLight.diffuse * diff * vec3(texture(uMaterial.diffuse, vTexCoord));

	vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
	vec3 specular = uLight.specular * spec * vec3(texture(uMaterial.specular, vTexCoord));

	vec3 result = (ambient + diffuse + specular);
	oFragColor = vec4(result, 1.0);
}
