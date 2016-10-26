function rectangle(scene,x1,y1,x2,y2,length_s,length_t) {
  this.scene = scene;
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.length_s = length_s;
  this.length_t = length_t;
  CGFobject.call(this, scene);
  this.initBuffers();
};

rectangle.prototype = Object.create(CGFobject.prototype);
rectangle.prototype.constructor = rectangle;

rectangle.prototype.initBuffers = function() {
  this.primitiveType = this.scene.gl.TRIANGLES;

  this.vertices = [
      this.x1, this.y1, 0,
      this.x2, this.y1, 0,
      this.x2, this.y2, 0,
      this.x1, this.y2, 0
  ];

  this.indices = [
      0, 1, 2,
      2, 3, 0
  ];

  this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
  ];

  this.texCoords = [
    this.length_s, 0,
    0, 0,
    0, this.length_t,
    this.length_s, this.length_t
  ];

  this.initGLBuffers();
};
