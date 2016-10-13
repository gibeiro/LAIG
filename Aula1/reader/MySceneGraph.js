MySceneGraph.prototype.parseScene = function(node){
		console.log("Scene");
		this.scene = {};
		this.scene.root = this.reader.getString(node, "root");
		this.scene.axis_length = this.reader.getString(node, "axis_length");
		
		console.log("root=" + this.scene.root);
		console.log("axis_length=" + this.scene.axis_length);
		console.log("");		
	
}
MySceneGraph.prototype.parsePrespective = function(node){
	
		console.log("Prespective");
		var prespective = {};
		prespective.id = this.reader.getString(node,"id");
		prespective.near = this.reader.getFloat(node,"near");
		prespective.far = this.reader.getFloat(node,"far");
		prespective.angle = this.reader.getFloat(node,"angle");
		console.log("id="+prespective.id);
		console.log("near="+prespective.near);
		console.log("far="+prespective.far);
		console.log("angle="+prespective.angle);		
		prespective.from = {};
		prespective.to = {};
		prespective.from.x = this.reader.getFloat(node.children[0],"x");
		prespective.from.y = this.reader.getFloat(node.children[0],"y");
		prespective.from.z = this.reader.getFloat(node.children[0],"z");
		prespective.to.x = this.reader.getFloat(node.children[1],"x");
		prespective.to.y = this.reader.getFloat(node.children[1],"y");
		prespective.to.z = this.reader.getFloat(node.children[1],"z");
		this.prespectives[prespective.id] = prespective;
		console.log("from.x="+prespective.from.x);
		console.log("from.y="+prespective.from.y);
		console.log("from.z="+prespective.from.z);
		console.log("to.x="+prespective.to.x);
		console.log("to.y="+prespective.to.y);
		console.log("to.z="+prespective.to.z);
		console.log("");
	
}
MySceneGraph.prototype.parseViews = function(node){
		console.log("Views");
		this.default_prespective = this.reader.getString(node, "default");
		console.log("default=" + this.default_prespective);
		this.prespectives = [];
		
		for(var i = 0; i < node.children.length; i++)
			this.parsePrespective(node.children[i]);
		
		console.log("");	
	
}
MySceneGraph.prototype.parseIllumination = function(node){
		console.log("Illumination");
		this.illumination = {};
		this.illumination.doublesided = this.reader.getBoolean(node, "doublesided",true);
		this.illumination.local = this.reader.getBoolean(node, "local",true);
		console.log("doublesided="+this.illumination.doublesided);
		console.log("local="+this.illumination.local);
		this.illumination.ambient = {};
		this.illumination.background = {};
		this.illumination.ambient.r = this.reader.getFloat(node.children[0],"r");
		this.illumination.ambient.g = this.reader.getFloat(node.children[0],"g");
		this.illumination.ambient.b = this.reader.getFloat(node.children[0],"b");
		this.illumination.ambient.a = this.reader.getFloat(node.children[0],"a");
		this.illumination.background.r = this.reader.getFloat(node.children[1],"r");
		this.illumination.background.g = this.reader.getFloat(node.children[1],"g");
		this.illumination.background.b = this.reader.getFloat(node.children[1],"b");
		this.illumination.background.a = this.reader.getFloat(node.children[1],"a");
		console.log("ambient.r="+this.illumination.ambient.r);
		console.log("ambient.g="+this.illumination.ambient.g);
		console.log("ambient.b="+this.illumination.ambient.b);
		console.log("ambient.a="+this.illumination.ambient.a);
		console.log("background.r="+this.illumination.ambient.r);
		console.log("background.g="+this.illumination.ambient.g);
		console.log("background.b="+this.illumination.ambient.b);
		console.log("background.a="+this.illumination.ambient.a);		
		console.log("");
	
}
MySceneGraph.prototype.parseOmni = function(node){
	console.log("Omni");
		var omni = {}
		omni.target= {};
		omni.location= {};
		omni.ambient= {};
		omni.diffuse= {};
		omni.specular= {};
		omni.id = this.reader.getString(node,"id");
		omni.type = "omni";
		omni.enabled = this.reader.getBoolean(node,"enabled",1);
		omni.location.x = this.reader.getFloat(node.children[0],"x");
		omni.location.y = this.reader.getFloat(node.children[0],"y");
		omni.location.z = this.reader.getFloat(node.children[0],"z");
		omni.location.w = this.reader.getFloat(node.children[0],"w");
		omni.ambient.r = this.reader.getFloat(node.children[1],"r");
		omni.ambient.g = this.reader.getFloat(node.children[1],"g");
		omni.ambient.b = this.reader.getFloat(node.children[1],"b");
		omni.ambient.a = this.reader.getFloat(node.children[1],"a");
		omni.diffuse.r = this.reader.getFloat(node.children[2],"r");
		omni.diffuse.g = this.reader.getFloat(node.children[2],"g");
		omni.diffuse.b = this.reader.getFloat(node.children[2],"b");
		omni.diffuse.a = this.reader.getFloat(node.children[2],"a");
		omni.specular.r = this.reader.getFloat(node.children[3],"r");
		omni.specular.g = this.reader.getFloat(node.children[3],"g");
		omni.specular.b = this.reader.getFloat(node.children[3],"b");
		omni.specular.a = this.reader.getFloat(node.children[3],"a");
		this.lights[omni.id] = omni;
		console.log("id="+omni.id);
		console.log("enabled="+omni.enabled);
		console.log("location.x="+omni.location.x);
		console.log("location.y="+omni.location.y);	
		console.log("location.z="+omni.location.z);
		console.log("location.w="+omni.location.w);
		console.log("ambient.r="+omni.ambient.r);
		console.log("ambient.g="+omni.ambient.g);
		console.log("ambient.b="+omni.ambient.b);
		console.log("ambient.a="+omni.ambient.a);
		console.log("diffuse.r="+omni.ambient.r);
		console.log("diffuse.g="+omni.ambient.g);
		console.log("diffuse.b="+omni.ambient.b);
		console.log("diffuse.a="+omni.ambient.a);
		console.log("specular.r="+omni.ambient.r);
		console.log("specular.g="+omni.ambient.g);
		console.log("specular.b="+omni.ambient.b);
		console.log("specular.a="+omni.ambient.a);
		console.log("");
	
}
MySceneGraph.prototype.parseSpot = function(node){
		console.log("Spot");
		var spot = {}
		spot.target= {};
		spot.location= {};
		spot.ambient= {};
		spot.diffuse= {};
		spot.specular= {};
		spot.id = this.reader.getString(node,"id");
		spot.type = "spot";
		spot.enabled = this.reader.getBoolean(node,"enabled",1);
		spot.angle = this.reader.getFloat(node,"angle");
		spot.exponent = this.reader.getFloat(node,"exponent");
		spot.target.x = this.reader.getFloat(node.children[0],"x");
		spot.target.y = this.reader.getFloat(node.children[0],"y");
		spot.target.z = this.reader.getFloat(node.children[0],"z");
		spot.location.x = this.reader.getFloat(node.children[1],"x");
		spot.location.y = this.reader.getFloat(node.children[1],"y");
		spot.location.z = this.reader.getFloat(node.children[1],"z");
		spot.ambient.r = this.reader.getFloat(node.children[2],"r");
		spot.ambient.g = this.reader.getFloat(node.children[2],"g");
		spot.ambient.b = this.reader.getFloat(node.children[2],"b");
		spot.ambient.a = this.reader.getFloat(node.children[2],"a");
		spot.diffuse.r = this.reader.getFloat(node.children[3],"r");
		spot.diffuse.g = this.reader.getFloat(node.children[3],"g");
		spot.diffuse.b = this.reader.getFloat(node.children[3],"b");
		spot.diffuse.a = this.reader.getFloat(node.children[3],"a");
		spot.specular.r = this.reader.getFloat(node.children[4],"r");
		spot.specular.g = this.reader.getFloat(node.children[4],"g");
		spot.specular.b = this.reader.getFloat(node.children[4],"b");
		spot.specular.a = this.reader.getFloat(node.children[4],"a");
		this.lights[spot.id] = spot;
		console.log("id="+spot.id);
		console.log("enabled="+spot.enabled);
		console.log("angle="+spot.angle);
		console.log("exponent="+spot.exponent);
		console.log("target.x="+spot.target.x);
		console.log("target.y="+spot.target.y);
		console.log("target.z="+spot.target.z);
		console.log("location.x="+spot.location.x);
		console.log("location.y="+spot.location.y);
		console.log("location.z="+spot.location.z);
		console.log("ambient.r="+spot.ambient.r);
		console.log("ambient.g="+spot.ambient.g);
		console.log("ambient.b="+spot.ambient.b);
		console.log("ambient.a="+spot.ambient.a);
		console.log("diffuse.r="+spot.ambient.r);
		console.log("diffuse.g="+spot.ambient.g);
		console.log("diffuse.b="+spot.ambient.b);
		console.log("diffuse.a="+spot.ambient.a);
		console.log("specular.r="+spot.ambient.r);
		console.log("specular.g="+spot.ambient.g);
		console.log("specular.b="+spot.ambient.b);
		console.log("specular.a="+spot.ambient.a);
		console.log("");
	
}
MySceneGraph.prototype.parseLights = function(node){
		console.log("Lights");
		console.log("");
		this.lights = [];
		var omni = node.getElementsByTagName("omni");
		var spot = node.getElementsByTagName("spot");
		for(var i = 0; i < omni.length;i++)
			this.parseOmni(omni[i]);
		for(var i = 0; i < spot.length;i++)
			this.parseSpot(spot[i]);
	
}

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
	/*var error = this.parseDSX(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	
*/
	console.log("DSX");
	this.parseScene(rootElement.children[0]);
	this.parseViews(rootElement.children[1]);
	this.parseIllumination(rootElement.children[2]);
	this.parseLights(rootElement.children[3]);
	/*
	this.parseTextures(rootElement.children[4]);
	this.parseMaterials(rootElement.children[5]);
	this.parseTransformations(rootElement.children[6]);
	this.parsePrimitives(rootElement.children[7]);
	this.parseComponents(rootElement.children[8]);	
	*/
	console.log("");
	
	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
/*

parser.prototype.parseComponents= function(rootElement) {
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
				//if(components[component.parent].materials != null)
				//component.materials = components[component.parent].materials;
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
			if(child_.nodeName = "componentref"){
				if(components[id_child] == null)
					components[id_child] = {};			
					components[id_child].parent = id;
			}
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

	
}

DSX.prototype.parseMaterials= function(rootElement) {
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
*/
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


