function piece(scene){
  this.scene = scene;
  this.directions = [];

  this.cylinder = new cylinder(scene,1,1,1,20,1);
  this.sphere = new sphere(scene,1,2,20);
  // this.shader = new CGFshader(
    // this.scene.gl,
    // "src/shaders/piece.vert",
    // "src/shaders/piece.frag"
  // );
  
  this.appearance =  new CGFappearance(scene);

  // this.shader.setUniformsValues({uSampler2: 1});
  // this.shader.setUniformsValues({rgba: [0.6,0.6,0.6,0.6]});	
	this.set_color([1,0.1,0.1,1]);
  this.set_directions([0]);
}
piece.prototype.constructor = piece;

piece.prototype.set_directions = function(directions){
  this.directions = directions;
}

piece.prototype.set_color = function(rgba){
	  // this.shader.setUniformsValues({rgba: rgba});
	this.appearance.setEmission(
	rgba[0],
	rgba[1],
	rgba[2],
	rgba[3]
	);
}

piece.prototype.display = function(){
	
	  // this.scene.setActiveShader(this.shader);

	this.appearance.apply();
  this.sphere.display();
  
  this.scene.pushMatrix();
  this.scene.translate(0,.4,0);
    this.sphere.display();

  this.scene.scale(1,0.4,1);  
  this.scene.rotate(Math.PI/2,1,0,0);  
  this.cylinder.display();
  this.scene.popMatrix();   

  for(var i = 0; i < this.directions.length; i++){
	var direction = this.directions[i];
	if(direction < 0 || direction > 7)
		  continue;
	direction = (direction+2)%8;	  
	this.scene.pushMatrix();
	this.scene.rotate(
		direction*Math.PI/4,
		0,
		1,
		0
	);
	this.scene.translate(0,0.35,0);
	this.scene.scale(0.1,0.1,0.95);
	  
	this.cylinder.display();
	this.scene.popMatrix();

  }

  // this.scene.setActiveShader(this.scene.defaultShader);

}
