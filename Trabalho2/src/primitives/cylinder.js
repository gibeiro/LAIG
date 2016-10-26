function cylinder(scene,base,top,height,slices,stacks,length_s,length_t) {
  this.scene = scene;
  this.base = base;
  this.top = top;
  this.height = height;
  this.slices = slices;
  this.stacks = stacks;
  this.length_s = length_s;
  this.length_t = length_t;
  CGFobject.call(this, scene);
  this.initBuffers();
};

cylinder.prototype = Object.create(CGFobject.prototype);
cylinder.prototype.constructor = cylinder;

cylinder.prototype.initBuffers = function() {
  var degree2rad= Math.PI/180.0;
  var incAngle=(360/this.slices)*degree2rad;
  var angle=0;
  var varAltura=1/this.stacks;

  this.vertices=[];
  this.normals = [];
  for(var i=0; i<=this.stacks;i++){
    for(j = 0 ; j <= this.slices ;j++){
      angle = j*incAngle;
      this.vertices.push(Math.cos(angle)*((1-i/this.stacks)*this.base + (i/this.stacks)*this.top)); //angulo pertencente a face anterior e a sua normal
      this.vertices.push(Math.sin(angle)*((1-i/this.stacks)*this.base + (i/this.stacks)*this.top));
      this.vertices.push(i/this.stacks*this.height);
      this.normals.push(Math.cos(angle));
      this.normals.push(Math.sin(angle));
      this.normals.push(-(this.top-this.base)/this.height);
    }
  }

  this.indices = [];
  for(var j = 0; j < this.stacks; j++){
    for(var i=0; i < this.slices ; i++){
      this.indices.push(j*(this.slices+1)+i);
      this.indices.push(j*(this.slices+1)+i+1);
      this.indices.push((j+1)*(this.slices+1)+i);

      this.indices.push(j*(this.slices+1)+i+1);
      this.indices.push((j+1)*(this.slices+1)+i+1);
      this.indices.push((j+1)*(this.slices+1)+i);
    }
  }

  this.texCoords = [];
  for(var i=0; i<=this.stacks;i++){
    for(angle = 0 ; angle < 2*Math.PI ; angle+=incAngle){
      this.texCoords.push(angle/(2*Math.PI)/this.length_s,i/(this.stacks)/this.length_t);
    }
  }


  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};
