#ifdef GL_ES
precision highp float;
#endif

struct lightProperties {
    vec4 position;
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 half_vector;
    vec3 spot_direction;
    float spot_exponent;
    float spot_cutoff;
    float constant_attenuation;
    float linear_attenuation;
    float quadratic_attenuation;
    bool enabled;
};
#define NUMBER_OF_LIGHTS 8
uniform lightProperties uLight[NUMBER_OF_LIGHTS];


varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

void main() {
    vec4 color;
    float gapx = 1.0/du;
    float gapy = 1.0/dv;

    if(
      mod(floor(vTextureCoord[0]/gapx),2.0) == 0.0 &&
      mod(floor(vTextureCoord[1]/gapy),2.0) == 0.0 ||
      mod(floor(vTextureCoord[0]/gapx),2.0) != 0.0 &&
      mod(floor(vTextureCoord[1]/gapy),2.0) != 0.0
      )
      color = c1;
    else
      color = c2;

    if(
      floor(vTextureCoord[0]/gapx) == su &&
      floor(vTextureCoord[1]/gapy) == sv
      )
      color = cs;

		gl_FragColor =  texture2D(uSampler,vTextureCoord) * color;
}
