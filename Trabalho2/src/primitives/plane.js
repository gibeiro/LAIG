function plane(scene,dimX,dimY,partsX,partsY) {

  this.scene = scene;
  this.dimX = dimX;
  this.dimY = dimY;
  this.partsX = partsX;
  this.partsY = partsY;

  var knots1 = this.getKnotsVector(1);
  var knots2 = this.getKnotsVector(1);

  var controlvertexes =
  [
    [
      [-0.5,0.5,0,1],
      [0.5,0.5,0,1],

    ],
    [
      [-0.5,-0.5,0,1],
      [0.5,-0.5,0,1],

    ],

  ];
  /*
  for(var i = 0; i < partsX + 1; i++){
    var tmp1 = [];
    for(var j = 0; j < partsY + 1; j++){
      var tmp2 = [];
      tmp2.push(
        (i/partsX-0.5)*dimX,
        (j/partsY-0.5)*dimY,
        0,
        1
      );
      tmp1.push(tmp2);
    }
    controlvertexes.push(tmp1);
  }*/

  var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, controlvertexes);

  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };
  CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);
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
