function sphere(scene,radius,slices,stacks,length_s,length_t) {
  this.scene = scene;
  this.radius = radius;
  this.slices = slices;
  this.stacks = stacks;
  this.length_s = length_s;
  this.length_t = length_t;
  CGFobject.call(this, scene);
  this.initBuffers();
};

sphere.prototype = Object.create(CGFobject.prototype);
sphere.prototype.constructor = sphere;

sphere.prototype.initBuffers = function() {
  this.primitiveType = this.scene.gl.TRIANGLES;

  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

  for (var lat = 0; lat <= this.stacks; lat++) {
      var theta = lat * Math.PI / this.stacks;

      for (var long = 0; long <= this.slices; long++) {
          var phi = long * 2 * Math.PI / this.slices;

          var x = this.radius * Math.cos(phi) * Math.sin(theta);
          var y = this.radius * Math.sin(phi) * Math.sin(theta);
          var z = this.radius * Math.cos(theta);

          this.vertices.push(x, y, z);
          this.texCoords.push(long / this.slices/this.length_s, lat / this.stacks/this.length_t);
      }
  }
  this.normals = this.vertices;

  for (var lat = 0; lat < this.stacks; lat++) {
      for (var long = 0; long < this.slices; long++) {
          var first = (lat * (this.slices + 1)) + long;
          var second = first + this.slices + 1;
          this.indices.push(first, second, first + 1);
          this.indices.push(second, second + 1, first + 1);
      }
  }

  // Takes the data in vertices, indices and normals and puts in buffers to be used by WebGl.
  this.initGLBuffers();
};
