function torus(scene, inner, outer, slices, loops,length_s,length_t) {
  this.scene = scene;
  this.inner = inner;
  this.outer = outer;
  this.slices = slices;
  this.loops = loops;
  this.length_s = length_s;
  this.length_t = length_t;
  CGFobject.call(this, scene);
  this.initBuffers();
};

torus.prototype = Object.create(CGFobject.prototype);
torus.prototype.constructor = torus;

torus.prototype.initBuffers = function() {
  var degree2rad= Math.PI/180.0;
var incAngle=(360/this.loops)*degree2rad;
var incAngle2=(360/this.slices)*degree2rad;
var radius = (this.outer-this.inner)/2;
var angle=0;
this.vertices=[];
this.normals = [];
this.texCoords = [];
//Ponto à volta do qual cada seccao do torus é desenhada
var rotatingpoint = [];

for(var i=0; i<=this.loops;i+=1){
  var pointAngle = i*incAngle;
  rotatingpoint[0] = (radius+this.inner) * Math.cos(pointAngle);
  rotatingpoint[1] = (radius+this.inner) * Math.sin(pointAngle);
  rotatingpoint[2] = 0;

  for(j = 0 ; j <= this.slices ; j++){
  angle = j*incAngle2;
  this.vertices.push(rotatingpoint[0]+radius*Math.cos(pointAngle)*Math.cos(angle));
  this.vertices.push(rotatingpoint[1]+radius*Math.sin(pointAngle)*Math.cos(angle));
  this.vertices.push(rotatingpoint[2]+radius*Math.sin(angle));
  this.normals.push(radius*Math.cos(pointAngle)*Math.cos(angle));
  this.normals.push(radius*Math.sin(pointAngle)*Math.cos(angle));
  this.normals.push(radius*Math.sin(angle));
  this.texCoords.push(i/this.loops/this.length_s, (1-j/this.slices)/this.length_t);
  }
}

this.indices = [];

for(var j = 0; j < this.loops; j++){
  for(var i=0; i < this.slices ; i++){
    this.indices.push(j*(this.slices+1)+i);
    this.indices.push((j+1)*(this.slices+1)+i);
    this.indices.push(j*(this.slices+1)+i+1);
    this.indices.push(j*(this.slices+1)+i+1);
    this.indices.push((j+1)*(this.slices+1)+i);
    this.indices.push((j+1)*(this.slices+1)+i+1);

  }
}


this.primitiveType = this.scene.gl.TRIANGLES;
this.initGLBuffers();
};
