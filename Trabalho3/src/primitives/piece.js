function piece(scene, directions){
  this.scene = scene;
  this.directions = directions;

  while(this.directions.length != 4)
    this.directions.push(-1.0);

  this.cylinder = new cylinder(scene,1,1,1,15,15);
  this.sphere = new sphere(scene,1,2,15);
}
piece.prototype.constructor = piece;

piece.prototype.set_directions = function(directions){
  this.directions = directions;
}

piece.prototype.display = function(){

  this.scene.pushMatrix();

  this.scene.scale(1,0.3,1);
  this.scene.rotate(Math.PI/2,1,0,0);
  this.cylinder.display();

  this.scene.pushMatrix();
  this.scene.translate(0,1,0);
  this.scene.scale(0.1,0.1,1);

  for(var i = 0; i < this.directions.length; i++){
    this.scene.pushMatrix();
    switch(this.directions[i]){
      default:
      this.scene.rotate(
        (this.directions[i]*2)*Math.PI/15,
        0,
        1,
        0
      );
      break;
      case -1:
      continue;
    }
    this.cylinder.display();
    this.scene.popMatrix();
}

  this.scene.popMatrix();

}
