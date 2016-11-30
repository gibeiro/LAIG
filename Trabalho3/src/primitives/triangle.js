function triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3,length_s,length_t) {
  this.scene = scene;
  this.x1 = x1;
  this.y1 = y1;
  this.z1 = z1;
  this.x2 = x2;
  this.y2 = y2;
  this.z2 = z2;
  this.x3 = x3;
  this.y3 = y3;
  this.z3 = z3;
  this.length_s = length_s;
  this.length_t = length_t;
  CGFobject.call(this, scene);
  this.initBuffers();
};

triangle.prototype = Object.create(CGFobject.prototype);
triangle.prototype.constructor = triangle;

triangle.prototype.initBuffers = function() {
  this.primitiveType = this.scene.gl.TRIANGLES;

  this.vertices = [
      this.x1, this.y1, this.z1,
      this.x2, this.y2, this.z2,
      this.x3, this.y3, this.z3
  ];

  this.indices = [
      0, 1, 2
  ];

  var xp = this.y1 * this.z2 - this.z1 * this.y2;
  var yp = this.z1 * this.x2 - this.x1 * this.z2;
  var zp = this.x1 * this.y2 - this.y1 * this.x2;

  this.normals = [
      xp, yp, zp,
      xp, yp, zp,
      xp, yp, zp,
  ];

  this.texCoords = [
      0, 0,
      1, 0,
      1, 1
  ];

  this.initGLBuffers();
};
