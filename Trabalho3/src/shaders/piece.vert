#define N   0.0
#define NE  1.0
#define E   2.0
#define SE  3.0
#define S   4.0
#define SW  5.0
#define W   6.0
#define NW  7.0
#define END	-1.0
#define PI 3.1415926535897932384626433832795

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
/*
	float vertex_direction;
	if(aVertexPosition.x == 0.0 && aVertexPosition.z > 0.0)
	vertex_direction = E;
	else if(aVertexPosition.x == 0.0 && aVertexPosition.z < 0.0)
	vertex_direction = W;
	else if(aVertexPosition.z == 0.0 && aVertexPosition.x > 0.0)
	vertex_direction = N;
	else if(aVertexPosition.z == 0.0 && aVertexPosition.x < 0.0)
	vertex_direction = S;
	else if(aVertexPosition.z == aVertexPosition.x && aVertexPosition.z > 0.0)
	vertex_direction = NE;
	else if(aVertexPosition.z == aVertexPosition.x && aVertexPosition.z < 0.0)
	vertex_direction = SW;
	else if(aVertexPosition.z == -aVertexPosition.x && aVertexPosition.z > 0.0)
	vertex_direction = SE;
	else if(aVertexPosition.z == -aVertexPosition.x && aVertexPosition.z < 0.0)
	vertex_direction = NW;
	else
	vertex_direction = END;

	if(vertex_direction == END)
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	else if(
		vertex_direction == a ||
		vertex_direction == b ||
		vertex_direction == c ||
		vertex_direction == d
		)
		gl_Position =
		uPMatrix *
		uMVMatrix *
		vec4(aVertexPosition + vec3(0.0,1.0,0.0), 1.0);
*/
	}
