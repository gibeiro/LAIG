#define N   0
#define NE  1
#define E   2
#define SE  3
#define S   4
#define SW  5
#define W   6
#define NW  7
#define END	-1
#define PI 3.1415926535897932384626433832795

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform int directions[4];

float round(float val){
	return floor(val+0.5);
}

void main() {
	float angle = atan(aVertexPosition.z/aVertexPosition.x);
	float delta = PI/8.0;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	for(int i = 0; i < directions.length(); i++){
		if(directions[i] == END)
			break;
		if(angle == delta*directions[i]){
			gl_Position =
			uPMatrix *
			uMVMatrix *
			vec4(aVertexPosition + vec3(0.0,0.4,0.0), 1.0);
			break;
		}
	}
}
