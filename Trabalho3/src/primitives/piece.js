function piece(scene, directions){
  this.scene = scene;
  this.sphere = new sphere(scene,1,2,15);
  this.shader = new CGFshader(
    this.scene.gl,
    "src/shaders/piece.vert",
    null
  );

  for(var i = 0; i < 4; i++){
    switch(directions[i]){
      case 'N':
      directions[i] = 0;
      break;
      case 'NE':
      directions[i] = 1;
      break;
      case 'E':
      directions[i] = 2;
      break;
      case 'SE':
      directions[i] = 3;
      break;
      case 'S':
      directions[i] = 4;
      break;
      case 'SW':
      directions[i] = 5;
      break;
      case 'W':
      directions[i] = 6;
      break;
      case 'NW':
      directions[i] = 7;
      break;
      case null:
      directions[i] = -1;
      break;
    }
  }

  this.shader.setUniformsValues({uSampler2: 1});
  this.shader.setUniformsValues({directions: this.du});

}
piece.prototype.constructor = piece;

piece.prototype.display = function(){
  this.scene.setActiveShader(this.shader);
  this.scene.pushMatrix();
  this.scene.scale(1,0.1,1);
  this.sphere.display();
  this.scene.popMatrix();
  this.scene.setActiveShader(this.scene.defaultShader);
}
