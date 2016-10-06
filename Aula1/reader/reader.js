
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;
		
	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	 
	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseDSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */


MySceneGraph.prototype.parseComponents= function(rootElement) {
	var components = [];
	var components_ = rootElement.getElementsByTagName("component");
	for(var i = 0; i < components_.length; i++){		
		var component_ = components_[i];
		var id = this.reader.getString(component_,"id");		
		var component = {};
		
		//transformation
		var transformation_ = component_.children[0];		
		var transformationref_ = transformation_.getElementsByTagName("transformationref")[0];
		if(transformationref_ != null)
			component.transformation = this.reader.getString(transformationref_,"id");
		else{
			var transformation = {};		
			var translate = transformation_.getElementsByTagName("translate");
			var rotate = transformation_.getElementsByTagName("rotate");
			var scale = transformation_.getElementsByTagName("scale");
			for(var i = 0; i < translate.length; i++){
				var tmp = {};
				tmp.x = this.reader.getFloat(translate[i],"x");
				tmp.y = this.reader.getFloat(translate[i],"y");
				tmp.z = this.reader.getFloat(translate[i],"z");
				transformation.translate[i] = tmp;
			}
			for(var i = 0; i < rotate.length; i++){
				var tmp = {};
				tmp.axis = this.reader.getFloat(rotate[i],"axis");
				tmp.angle = this.reader.getFloat(translate[i],"angle");
				transformation.rotate[i] = tmp;
			}
			for(var i = 0; i < scale.length; i++){
				var tmp = {};
				tmp.x = this.reader.getFloat(scale[i],"x");
				tmp.y = this.reader.getFloat(scale[i],"y");
				tmp.z = this.reader.getFloat(scale[i],"z");
				transformation.translate[i] = tmp;
			}
			component.transformation = "transformation" + this.dsx.tranformations.length;
			this.dsx.tranformations[component.transformation] = transformation;
		}
		
		//materials
		component.materials = [];		
		var materials_ = component_.getElementsByTagName("materials")[0].children;
		for(var i = 0; i < materials_.length; i++){
			var material_ = materials_[i];
			var id_material = this.reader.getString(material_,"id");
			if(material_.nodeName == "materialref"){
				push(component.materials,id_material); 
				continue;
			}			
			if(id_material = "inherit"){
				component.materials = components[component.parent].materials;
				break;
			}
			var material;
			var emission = material_.getElementsByTagName("emission")[0];
			var ambient = material_.getElementsByTagName("ambient")[0];
			var diffuse = material_.getElementsByTagName("diffuse")[0];
			var specular = material_.getElementsByTagName("specular")[0];
			var shininess = material_.getElementsByTagName("shininess")[0];
			material.emission.r = this.reader.getFloat(emission, "r");
			material.emission.g = this.reader.getFloat(emission, "g");
			material.emission.b = this.reader.getFloat(emission, "b");
			material.emission.a = this.reader.getFloat(emission, "a");
			material.ambient.r = this.reader.getFloat(ambient, "r");
			material.ambient.g = this.reader.getFloat(ambient, "g");
			material.ambient.b = this.reader.getFloat(ambient, "b");
			material.ambient.a = this.reader.getFloat(ambient, "a");
			material.diffuse.r = this.reader.getFloat(diffuse, "r");
			material.diffuse.g = this.reader.getFloat(diffuse, "g");
			material.diffuse.b = this.reader.getFloat(diffuse, "b");
			material.diffuse.a = this.reader.getFloat(diffuse, "a");
			material.specular.r = this.reader.getFloat(specular, "r");
			material.specular.g = this.reader.getFloat(specular, "g");
			material.specular.b = this.reader.getFloat(specular, "b");
			material.specular.a = this.reader.getFloat(specular, "a");
			material.shininess.value = this.reader.getFloat(shininess, "value");
			this.dsx.materials[id_material] = material;
			push(component.materials,id_material);
		}
		
		//texture
		var texture_ = component_.getElementsByTagName("texture")[0];
		var id_texture = this.reader.getString(texture_,"id");
		switch(id_texture){
			case "inherit":
				component.texture = components[component.parent].texture;
				break;
			case "none":
				var texture;
				texture.file = this.reader.getString(texture_,"file");
				texture.length_s = this.reader.getString(texture_,"length_s");
				texture.length_t = this.reader.getString(texture_,"length_t");
				id_texture = "texture" + this.sdx.textures.length;
				this.sdx.textures[id_texture] = texture;
				component.texture = id_texture;				
				break;
			default:
				component.texture = id_texture;
				break;
		}

		//children
		var children_ = component_.getElementsByTagName("children")[0].children;
		for(var i = 0; i < children_.length; i++){
			var child_ = children_[i];
			var id_child = this.reader.getString(child_,"id");
			var tag_name = child_.nodeName;
			if(child_.nodeName = "componentref")
				components[id_child].parent = id;
			else
				primitives[id_child].parent = id;
		
		}
		
	}
	return components;
}
MySceneGraph.prototype.parsePrimitives= function(rootElement) {
	var primitives = {};
	primitives.rectangle = [];
	primitives.triangle = [];
	primitives.cylinder = [];
	primitives.sphere = [];
	primitives.torus = [];
	var primitives_ = rootElement.getElementsByTagName("primitive");
	for(var i = 0; i < primitives_.length; i++){
		var primitive;
		var primitive_ = primitives_[i];
		switch(primitive_.nodeName){
			case "rectangle":
				primitive.x1 = this.reader.getFloat(primitive_,"x1");
				primitive.x2 = this.reader.getFloat(primitive_,"x2");
				primitive.y1 = this.reader.getFloat(primitive_,"y1");
				primitive.y2 = this.reader.getFloat(primitive_,"y2");
				primitives.rectangle[primitive_.id] = primitive;
			break;
			case "triangle":
				primitive.x1 = this.reader.getFloat(primitive_,"x1");
				primitive.x2 = this.reader.getFloat(primitive_,"x2");
				primitive.x3 = this.reader.getFloat(primitive_,"x3");
				primitive.y1 = this.reader.getFloat(primitive_,"y1");
				primitive.y2 = this.reader.getFloat(primitive_,"y2");
				primitive.y3 = this.reader.getFloat(primitive_,"y3");
				primitive.z1 = this.reader.getFloat(primitive_,"z1");
				primitive.z2 = this.reader.getFloat(primitive_,"z2");
				primitive.z3 = this.reader.getFloat(primitive_,"z3");
				primitives.triangle[primitive_.id] = primitive;
			break;
			case "cylinder":
				primitive.base = this.reader.getFloat(primitive_,"base");
				primitive.top = this.reader.getFloat(primitive_,"top");
				primitive.height = this.reader.getFloat(primitive_,"height");
				primitive.slices = this.reader.getInteger(primitive_,"slices");
				primitive.stacks = this.reader.getInteger(primitive_,"stacks");
				primitives.cylinder[primitive_.id] = primitive;
			break;
			case "sphere":
				primitive.radius = this.reader.getFloat(primitive_,"radius");
				primitive.slices = this.reader.getInteger(primitive_,"slices");
				primitive.stacks = this.reader.getInteger(primitive_,"stacks");
				primitives.sphere[primitive_.id] = primitive;
			break;
			case "torus":
				primitive.inner = this.reader.getFloat(primitive_,"inner");
				primitive.outer = this.reader.getFloat(primitive_,"outer");
				primitive.slices = this.reader.getInteger(primitive_,"slices");
				primitive.loops = this.reader.getInteger(primitive_,"loops");
				primitives.torus[primitive_.id] = primitive;
			break;
		}
	}
	return primitives;
}
MySceneGraph.prototype.parseScene= function(rootElement) {
	
	var scene = {};
	scene.root = this.reader.getString(rootElement, "root");
	scene.axis_length = this.reader.getString(rootElement, 'axis_length');
	console.log("scene root=" + scene.root + ", axis_length=" + scene.axis_length);	
	return scene;
	
}
MySceneGraph.prototype.parseViews= function(rootElement) {	
	var views = {};	
	views.default = this.reader.getString(rootElement, "default");
	console.log("views default=" + views.default);
	var prespectives = [];	
	for(var i = 0; i < rootElement.children.length; i++){
		var child = rootElement.children[i];
		var prespective = {};
		prespective.near = this.reader.getFloat(child,"near");
		prespective.far = this.reader.getFloat(child,"far");
		prespective.angle = this.reader.getFloat(child,"angle");
		var from = child.getElementsByTagName("from")[0];
		var to = child.getElementsByTagName("to")[0];
		prespective.from = {};
		prespective.to = {};
		prespective.from.x = this.reader.getFloat(from,"x");
		prespective.from.y = this.reader.getFloat(from,"y");
		prespective.from.z = this.reader.getFloat(from,"z");
		prespective.to.x = this.reader.getFloat(to,"x");
		prespective.to.y = this.reader.getFloat(to,"y");
		prespective.to.z = this.reader.getFloat(to,"z");
		prespectives[child.id] = prespective;
	}
	views.prespectives = prespectives;	
	
	return views;
}
MySceneGraph.prototype.parseMaterials= function(rootElement) {
	var materials = [];
	var materials_ = rootElement.getElementsByTagName("material");
	for(var i = 0 ; i < materials_.length; i++){
		var child = materials_[i];
		var material = {};
		var emission = child.getElementsByTagName("emission")[0];
		var ambient = child.getElementsByTagName("ambient")[0];
		var diffuse = child.getElementsByTagName("diffuse")[0];
		var specular = child.getElementsByTagName("specular")[0];
		var shininess = child.getElementsByTagName("shininess")[0];
		material.emission = {};
		material.ambient = {};
		material.diffuse = {};
		material.specular = {};
		material.shininess = {};
		material.emission.r = this.reader.getFloat(emission, "r");
		material.emission.g = this.reader.getFloat(emission, "g");
		material.emission.b = this.reader.getFloat(emission, "b");
		material.emission.a = this.reader.getFloat(emission, "a");
		material.ambient.r = this.reader.getFloat(ambient, "r");
		material.ambient.g = this.reader.getFloat(ambient, "g");
		material.ambient.b = this.reader.getFloat(ambient, "b");
		material.ambient.a = this.reader.getFloat(ambient, "a");
		material.diffuse.r = this.reader.getFloat(diffuse, "r");
		material.diffuse.g = this.reader.getFloat(diffuse, "g");
		material.diffuse.b = this.reader.getFloat(diffuse, "b");
		material.diffuse.a = this.reader.getFloat(diffuse, "a");
		material.specular.r = this.reader.getFloat(specular, "r");
		material.specular.g = this.reader.getFloat(specular, "g");
		material.specular.b = this.reader.getFloat(specular, "b");
		material.specular.a = this.reader.getFloat(specular, "a");
		material.shininess.value = this.reader.getFloat(shininess, "value");
		materials[child.id] = material;
	}
	return materials;
}
MySceneGraph.prototype.parseTextures= function(rootElement) {
	var textures = [];
	for(var i = 0; i < rootElement.children.length; i++){
		var child = rootElement.children[i];
		var texture = {};
		texture.file = this.reader.getString(child,"file");
		texture.length_s = this.reader.getString(child,"length_s");
		texture.length_t = this.reader.getString(child,"length_t");
		textures[child.id] = texture;		
	}
	return textures;
}
MySceneGraph.prototype.parseIllumination= function(rootElement) {
	var illumination = {};
	illumination.doublesided = this.reader.getInteger(rootElement, "doublesided");
	illumination.local = this.reader.getInteger(rootElement, "local");
	var ambient = rootElement.getElementsByTagName("ambient")[0];
	var background = rootElement.getElementsByTagName("background")[0];
	illumination.ambient = {};
	illumination.ambient.r = this.reader.getFloat(ambient,"r");
	illumination.ambient.g = this.reader.getFloat(ambient,"g");
	illumination.ambient.b = this.reader.getFloat(ambient,"b");
	illumination.ambient.a = this.reader.getFloat(ambient,"a");
	illumination.background = {};
	illumination.background.r = this.reader.getFloat(background,"r");
	illumination.background.g = this.reader.getFloat(background,"g");
	illumination.background.b = this.reader.getFloat(background,"b");
	illumination.background.a = this.reader.getFloat(background,"a");
	return illumination;
}
MySceneGraph.prototype.parseLights= function(rootElement) {
	var light = {};
	light.omni = [];
	light.spot = [];
	var omni = rootElement.getElementsByTagName("omni");
	var spot = rootElement.getElementsByTagName("spot");
	for(var i = 0; i < omni.length; i++){
		var child = omni[i];
		var location = child.getElementsByTagName("location")[0];
		var ambient = child.getElementsByTagName("ambient")[0];
		var diffuse = child.getElementsByTagName("diffuse")[0];
		var specular = child.getElementsByTagName("specular")[0];
		var tmp = {};
		tmp.location= {};
		tmp.ambient= {};
		tmp.diffuse= {};
		tmp.specular= {};
		tmp.location.x = this.reader.getFloat(location,"x");
		tmp.location.y = this.reader.getFloat(location,"y");
		tmp.location.z = this.reader.getFloat(location,"z");
		tmp.location.w = this.reader.getFloat(location,"w");
		tmp.ambient.r = this.reader.getFloat(ambient,"r");
		tmp.ambient.g = this.reader.getFloat(ambient,"g");
		tmp.ambient.b = this.reader.getFloat(ambient,"b");
		tmp.ambient.a = this.reader.getFloat(ambient,"a");
		tmp.diffuse.r = this.reader.getFloat(diffuse,"r");
		tmp.diffuse.g = this.reader.getFloat(diffuse,"g");
		tmp.diffuse.b = this.reader.getFloat(diffuse,"b");
		tmp.diffuse.a = this.reader.getFloat(diffuse,"a");
		tmp.specular.r = this.reader.getFloat(specular,"r");
		tmp.specular.g = this.reader.getFloat(specular,"g");
		tmp.specular.b = this.reader.getFloat(specular,"b");
		tmp.specular.a = this.reader.getFloat(specular,"a");
		light.omni[child.id] = tmp;
	}
	for(var i = 0; i < spot.length; i++){
		var child = spot[i];
		var target = child.getElementsByTagName("target")[0];
		var location = child.getElementsByTagName("location")[0];
		var ambient = child.getElementsByTagName("ambient")[0];
		var diffuse = child.getElementsByTagName("diffuse")[0];
		var specular = child.getElementsByTagName("specular")[0];
		var tmp = {};
		tmp.target= {};
		tmp.location= {};
		tmp.ambient= {};
		tmp.diffuse= {};
		tmp.specular= {};
		tmp.target.x = this.reader.getFloat(location,"x");
		tmp.target.y = this.reader.getFloat(location,"y");
		tmp.target.z = this.reader.getFloat(location,"z");
		tmp.location.x = this.reader.getFloat(location,"x");
		tmp.location.y = this.reader.getFloat(location,"y");
		tmp.location.z = this.reader.getFloat(location,"z");
		tmp.ambient.r = this.reader.getFloat(ambient,"r");
		tmp.ambient.g = this.reader.getFloat(ambient,"g");
		tmp.ambient.b = this.reader.getFloat(ambient,"b");
		tmp.ambient.a = this.reader.getFloat(ambient,"a");
		tmp.diffuse.r = this.reader.getFloat(diffuse,"r");
		tmp.diffuse.g = this.reader.getFloat(diffuse,"g");
		tmp.diffuse.b = this.reader.getFloat(diffuse,"b");
		tmp.diffuse.a = this.reader.getFloat(diffuse,"a");
		tmp.specular.r = this.reader.getFloat(specular,"r");
		tmp.specular.g = this.reader.getFloat(specular,"g");
		tmp.specular.b = this.reader.getFloat(specular,"b");
		tmp.specular.a = this.reader.getFloat(specular,"a");
		light.spot[child.id] = tmp;
	}
	light.omni = omni;
	light.spot = spot;
	return light;
}
MySceneGraph.prototype.parseTransformations= function(rootElement) {
	var transformations = [];
	var transformations_ = rootElement.getElementsByTagName("transformation");
	for(var i = 0; i < transformations_.length; i++){
		var transformation = {};
		transformation.rotate = [];
		transformation.translate = [];
		transformation.scale = [];
		var transformation_ = transformations_[i];	
		var translate = transformation_.getElementsByTagName("translate");
		var rotate = transformation_.getElementsByTagName("rotate");
		var scale = transformation_.getElementsByTagName("scale");
		for(var i = 0; i < translate.length; i++){
			var tmp = {};
			tmp.x = this.reader.getFloat(translate[i],"x");
			tmp.y = this.reader.getFloat(translate[i],"y");
			tmp.z = this.reader.getFloat(translate[i],"z");
			transformation.translate[i] = tmp;
		}
		for(var i = 0; i < rotate.length; i++){
			var tmp = {};
			tmp.axis = this.reader.getFloat(rotate[i],"axis");
			tmp.angle = this.reader.getFloat(rotate[i],"angle");
			transformation.rotate[i] = tmp;
		}
		for(var i = 0; i < scale.length; i++){
			var tmp = {};
			tmp.x = this.reader.getFloat(scale[i],"x");
			tmp.y = this.reader.getFloat(scale[i],"y");
			tmp.z = this.reader.getFloat(scale[i],"z");
			transformation.translate[i] = tmp;
		}
		transformations[transformation_.id] = transformation;
	}	
	return transformations;
}

MySceneGraph.prototype.parseDSX= function(rootElement) {
	this.dsx = {};
	this.dsx.scene = this.parseScene(rootElement.children[0]);
	this.dsx.views = this.parseViews(rootElement.children[1]);
	this.dsx.illumination = this.parseIllumination(rootElement.children[2]);
	this.dsx.lights = this.parseLights(rootElement.children[3]);
	this.dsx.textures = this.parseTextures(rootElement.children[4]);
	this.dsx.materials = this.parseMaterials(rootElement.children[5]);
	this.dsx.transformation = this.parseTransformations(rootElement.children[6]);
	this.dsx.primitives = this.parsePrimitives(rootElement.children[7]);
	this.dsx.components = this.parseComponents(rootElement.children[8]);	
}

MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


