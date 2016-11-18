function vehicle() {

  CGFobject.call(this, scene);
  this.initBuffers();
};

vehicle.prototype = Object.create(CGFnurbsObject.prototype);
vehicle.prototype.constructor = vehicle;
