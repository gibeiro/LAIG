var deg_rad = Math.PI / 180.0;

function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
  this.setGlobalAmbientLight(this.graph.illumination.ambient.r,this.graph.illumination.ambient.g,this.graph.illumination.ambient.b,this.graph.illumination.ambient.a);

	this.gl.clearColor(
    this.graph.illumination.background.r,
    this.graph.illumination.background.g,
    this.graph.illumination.background.b,
    this.graph.illumination.background.a
  );
	this.lights[0].setVisible(true);
    this.lights[0].enable();

    this.axis = new CGFaxis(this,this.scene.axis_length);

    console.log("Loading lights ...");
    for(var i = 0: i < this.graph.lights.length; i++)
        this.initLight(this.graph.lights[i]);

};

XMLscene.prototype.initLight = function (light) {

  var tmp = new CGFlight(this,light.id);

  tmp.setAmbient(
    light.ambient.r,
    light.ambient.g,
    light.ambient.b,
    light.ambient.a
  );

  tmp.setDiffuse(
      light.diffuse.r,
      light.diffuse.g,
      light.diffuse.b,
      light.diffuse.a
  );

  tmp.setSpecular(
      light.specular.r,
      light.specular.g,
      light.specular.b,
      light.specular.a
  );

  if(light.type == "omni"){
    tmp.setPosition(
      light.location.x,
      light.location.y,
      light.location.z,
      light.location.w
    );
  }
  if(light.type == "spot"){
    tmp.setPosition(
      light.location.x,
      light.location.y,
      light.location.z,
      1
    );
    tmp.setSpotDirection(
      light.target.x - light.location.x,
      light.target.y - light.location.y,
      light.target.z - light.location.z
    );
    tmp.setSpotExponent(
      light.exponent
    );
    tmp.setSpotCutOff(
      light.angle
    );
  }

  light.enabled ? tmp.enable() : tmp.disable();

  this.lights.push(tmp);

}

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
    this.displayGraph();
	};
};

XMLscene.prototype.displayGraph = function(root){

  while(var node = this.tree.DFS() != null){
    
  }

  this.tree.resetTraversal();

}
