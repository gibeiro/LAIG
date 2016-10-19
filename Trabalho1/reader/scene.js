
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.initDSX(this.dsx);
    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);
};

XMLscene.prototype.initScene = function (scene) {
};
XMLscene.prototype.initViews = function (views) {
//this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};
XMLscene.prototype.initLights = function (lights) {
	var n = 0;
	for(var i = 0; i < lights.omni.length; i++){
		this.lights[n].setPosition(lights.omni[i].location.x,lights.omni[i].location.y,lights.omni[i].location.z,lights.omni[i].location.w);
		this.lights[n].setAmbient(lights.omni[i].ambient.r,lights.omni[i].ambient.g,lights.omni[i].ambient.b,lights.omni[i].ambient.a);
		this.lights[n].setDiffuse(lights.omni[i].diffuse.r,lights.omni[i].diffuse.g,lights.omni[i].diffuse.b,lights.omni[i].diffuse.a);
		this.lights[n].setSpecular(lights.omni[i].specular.r,lights.omni[i].specular.g,lights.omni[i].specular.b,lights.omni[i].specular.a);
		this.lights[n].update();
		this.lights[n].setVisible(true);
		n++;
	}
	for(var i = 0; i < lights.spot.length; i++){
		this.lights[n].setSpotDirection(lights.spot[i].target.x,lights.spot[i].target.y,lights.spot[i].target.z);
		this.lights[n].setPosition(lights.spot[i].location.x,lights.spot[i].location.y,lights.spot[i].location.z,1);
		this.lights[n].setAmbient(lights.spot[i].ambient.r,lights.spot[i].ambient.g,lights.spot[i].ambient.b,1);
		this.lights[n].setDiffuse(lights.spot[i].diffuse.r,lights.spot[i].diffuse.g,lights.spot[i].diffuse.b,1);
		this.lights[n].setSpecular(lights.spot[i].specular.r,lights.spot[i].specular.g,lights.spot[i].specular.b,1);
		this.lights[n].update();
		this.lights[n].setVisible(true);
		n++;
	}
	
    /*
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    */
};
XMLscene.prototype.initIllumination = function (illumination) {
	this.setGlobalAmbientLight(illumination.ambient.r,illumination.ambient.g,illumination.ambient.b,illumination.ambient.a);
	this.gl.clearColor(illumination.background.r,illumination.background.g,illumination.background.b,illumination.background.a);
 /*
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
    */
};
XMLscene.prototype.initTextures = function (textures) {
};
XMLscene.prototype.initMaterials = function (materials) {
};
XMLscene.prototype.initTransformations = function (transformations) {
};
XMLscene.prototype.initPrimitives = function (primitives) {
};
XMLscene.prototype.initComponents = function (components) {
};
XMLscene.prototype.initDSX = function (dsx) {
	this.initScene(dsx.scene);
	this.initViews(dsx.views);
	this.initLights(dsx.lights);
	this.initIllumination(dsx.illumination);
	this.initTextures(dsx.textures);
	this.initMaterials(dsx.materials);
	this.initTransformations(dsx.transformations);
	this.initPrimitives(dsx.primitives);
	this.initComponents(dsx.components);
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.initDSX(this.dsx);
    	//this.initIllumination(this.dsx.illumination);	
	//this.initLights(this.dsx.light);
    
};

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
	};	
};

