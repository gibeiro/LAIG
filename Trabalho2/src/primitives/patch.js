function patch(scene,dimX,dimY,partsU,partsV,controlvertexes) {
  var knots1 = this.getKnotsVector(dimX);
  var knots2 = this.getKnotsVector(dimY);

  var nurbsSurface = new CGFnurbsSurface(dimX, dimY, knots1, knots2, controlvertexes);
  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };

  CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV );
};

patch.prototype = Object.create(CGFnurbsObject.prototype);
patch.prototype.constructor=patch;

patch.prototype.getKnotsVector = function(degree) {
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
