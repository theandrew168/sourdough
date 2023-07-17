#version 300 es

in vec4 aPosition;
in vec3 aNormal;

out vec3 vWorldPosition;
out vec3 vWorldNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
	vWorldPosition = (uModel * aPosition).xyz;
	vWorldNormal = mat3(uModel) * aNormal;
	gl_Position = uProjection * uView * uModel * aPosition;
}
