#version 300 es

in vec4 aPosition;
in vec2 aTexCoord;
in vec3 aNormal;

out vec2 vTexCoord;
out vec3 vNormal;
out vec3 vWorldPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
	vTexCoord = aTexCoord;
	vNormal = mat3(transpose(inverse(uModel))) * aNormal;
	vWorldPosition = vec3(uModel * aPosition);
	gl_Position = uProjection * uView * uModel * aPosition;
}
