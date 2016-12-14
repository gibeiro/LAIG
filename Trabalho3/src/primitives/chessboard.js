function chessboard(scene,du,dv,textureref,su,sv,c1,c2,cs) {
  this.scene = scene;
  this.du = du;
  this.dv = dv;
  this.texture = null;
  for(var i = 0; i < scene.graph.textures.length; i++)
    if(scene.graph.textures[i].id == textureref){
      this.texture = scene.graph.textures[i];
      break;
    }
  this.su = su;
  this.sv = sv;
  this.c1 = c1;
  this.c2 = c2;
  this.cs = cs;
  this.shader = new CGFshader(
    this.scene.gl,
    "src/shaders/chessboard.vert",
    "src/shaders/chessboard.frag"
  );
  this.chessboard = new plane(scene,1,1,du,dv);

  this.shader.setUniformsValues({uSampler2: 1});
  this.shader.setUniformsValues({du: this.du});
  this.shader.setUniformsValues({dv: this.dv});
  this.shader.setUniformsValues({su: this.su});
  this.shader.setUniformsValues({sv: this.sv});
  this.shader.setUniformsValues({c1: this.c1});
  this.shader.setUniformsValues({c2: this.c2});
  this.shader.setUniformsValues({cs: this.cs});
}

chessboard.prototype.constructor = chessboard;

chessboard.prototype.set_highlighted_tile = function(su,sv){
  this.shader.setUniformsValues({su: su});
  this.shader.setUniformsValues({sv: sv});
}


chessboard.prototype.display = function(){
  this.scene.setActiveShader(this.shader);
  if(this.texture != null)
  this.texture.bind();
  this.chessboard.display();
  if(this.texture != null)
  this.texture.unbind();
  this.scene.setActiveShader(this.scene.defaultShader);
}
