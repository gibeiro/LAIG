attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

float round(float val){
	return floor(val+0.5);
}

void main() {
	float gapx = 1.0/du;
	float gapy = 1.0/dv;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

if(su != -1.0 && sv != -1.0)
	if(
		(aTextureCoord[0])/gapx >= su &&
		(aTextureCoord[1])/gapy >= sv &&
		(aTextureCoord[0])/gapx <= su+1.0 &&
		(aTextureCoord[1])/gapy <= sv+1.0
		)
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+aVertexNormal*0.04, 1.0);

	vTextureCoord = aTextureCoord;
}
