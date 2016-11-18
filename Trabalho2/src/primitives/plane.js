function plane(scene,dimX,dimY,partsX,partsY) {
  var knots1 = this.getKnotsVector(dimX);
  var knots2 = this.getKnotsVector(dimY);

  var controlvertexes = [];
  for(var i = 0; i < partsX + 1; i++){
    controlvertexes[i] = [];
    for(var j = 0; j < partsY + 1; j++){
      controlvertexes[i][j] = [];
      controlvertexes[i][j].push(
          (i/partsX)*dimX-dimX/2,
          (j/partsY)*dimY-dimY/2,
          0,
          1
      );
    }
  }

  var nurbsSurface = new CGFnurbsSurface(dimX, dimY, knots1, knots2, controlvertexes);

  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };

  CGFnurbsObject.call(this, scene, getSurfacePoint, 20, 20 );
};

plane.prototype = Object.create(CGFnurbsObject.prototype);
plane.prototype.constructor = plane;

plane.prototype.getKnotsVector = function(degree) {
  var v = new Array();
  for (var i=0; i<=degree; i++) {
    v.push(0);
  }
  for (var i=0; i<=degree; i++) {
    v.push(1);
  }
  return v;
}
