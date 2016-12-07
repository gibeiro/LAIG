var degToRad = Math.PI / 180.0;


/**
 * Scene graph constructor
 *
 * @param  {type} filename Path of the .dsx file
 * @param  {type} scene    CGFscene object
 * @return {type}          graph object loaded with the .dsx informaton
 */
function graph(filename, scene) {
	this.loadedOk = null;
	this.scene = scene;
	scene.graph = this;
	this.reader = new CGFXMLreader();
	this.reader.open(filename, this);
}
graph.prototype.constructor = graph;


/**
 * Handles the parsing and validation of the .dsx information *
 */
graph.prototype.onXMLReady = function () {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	if (!this.validateOrder(rootElement)) return;
	var error = this.parseData(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}
	this.loadedOk = true;
	this.scene.onGraphLoaded();
};


/**
 * Validates de order of the XML nodes on the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.validateOrder = function (rootElement) {
	var nodes = rootElement.childNodes;
	var types = [];
	var names = ['scene', 'views', 'illumination', 'lights', 'textures',
	'materials', 'transformations', 'primitives', 'components', 'animations'];

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType == 1) {
			types.push(nodes[i]);
			console.info(nodes[i]);
		}
	}

	if (types.length < names.length) {
		// Missing nodes, checking which ones are missing
		var missingNodes = [];
		for (var name = 0; name < names.length; name++) {
			var found = false;
			for (var type = 0; type < types.length; type++) {

				if (names[name] == types[type].nodeName) {
					found = true;
					break;
				}
			}
			if (!found)
				missingNodes.push([names[name]]);

		}
		var errorText = "XML is missing the following nodes:\n";
		for (var i = 0; i < missingNodes.length; i++)
		errorText += "\t" + missingNodes[i] + ";\n";
		this.onXMLError(errorText + "Aborting!");
		return false;
	} else if (types.length > names.length)
	console.warn("Unexpected number of nodes, trying to parse anyway");


	for (var i = 0; i < names.length; i++) {
		if (names[i] != types[i].nodeName) {
			var found = false;
			for (var j = 0; j < types.length; j++) {
				if (names[i] == types[j].nodeName) {
					found = true;
					break;
				}
			}

			if (found) {
				console.warn(names[i] + " node found but in wrong place, trying to parse anyway");
			} else {
				this.onXMLError(names[i] + " node not found, aborting!");
				return false;
			}
		} else {
			console.debug(names[i] + " node found");
		}
	}

	return true;
}


/**
 * Parses data from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseData = function (rootElement) {
	/*
	* The variables before each method are the variables
	* that method populates in his body
	*/
	var err = null;

	this.axis;
	this.rootNodeId;
	err = this.parseScene(rootElement);
	if (err != null) return err;

	this.perspCams = [];
	err = this.parseViews(rootElement);
	if (err != null) return err;

	this.ambientLight;
	this.background;
	err = this.parseIllumination(rootElement);
	if (err != null) return err;

	this.omniLights = [];
	this.spotLights = [];
	err = this.parseLights(rootElement);
	if (err != null) return err;

	this.textures = [];
	err = this.parseTextures(rootElement);
	if (err != null) return err;

	this.materials = [];
	err = this.parseMaterials(rootElement);
	if (err != null) return err;

	this.transformations = [];
	err = this.parseTransformations(rootElement);
	if (err != null) return err;

	this.primitives = [];
	err = this.parsePrimitives(rootElement);
	if (err != null) return err;

	this.animations = [];
	err = this.parseAnimations(rootElement);
	if (err != null) return err;

	console.info("If you have more than 1 texture per component, all but the first one will be ignored");

	this.rootNode;
	err = this.parseNodes(rootElement);
	if (err != null) return err;

	console.log(this);
};

/**
 * Parses scene animations from the .dsx files
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseAnimations = function(rootElement){
	var animations = rootElement.getElementsByTagName('animations')[0];
	if(animations == null)
		return;

	for(var i = 0; i < animations.children.length; i++){
		var animation = animations.children[i];
		var animation_obj = {};
		animation_obj.id = this.reader.getString(animation,'id');
		animation_obj.span = this.reader.getFloat(animation,'span');
		animation_obj.type = this.reader.getItem(animation,'type',['linear','circular']);

		if(animation_obj.type == 'linear'){
			animation_obj.control_points = [];
			for(var j = 0; j < animation.children.length; j++){
				var controlpoint = animation.children[j];
				var control_point = [];
				control_point[0] = this.reader.getFloat(controlpoint,'xx');
				control_point[1] = this.reader.getFloat(controlpoint,'yy');
				control_point[2] = this.reader.getFloat(controlpoint,'zz');
				animation_obj.control_points.push(control_point);
			}
		}
		else if(animation_obj.type == 'circular'){
			animation_obj.center = this.reader.getVector3(animation, 'center');
			animation_obj.radius = this.reader.getFloat(animation, 'radius');
			animation_obj.startang = this.reader.getFloat(animation, 'startang');
			animation_obj.rotang = this.reader.getFloat(animation, 'rotang');
		}
		this.animations.push(animation_obj);
	}
};


/**
 * Parses scene information from .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseScene = function (rootElement) {
	var scene = rootElement.getElementsByTagName('scene')[0];
	var axisLength = this.reader.getFloat(scene, 'axis_length', true);
	var axisThickness = 0.2
	this.rootNodeId = this.reader.getString(scene, 'root', true);
	if(axisLength == 0)
		axisThickness = 0;
	this.axis = new CGFaxis(this.scene, axisLength, axisThickness);
};


/**
 * Parses scene views from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseViews = function (rootElement) {
	var views = rootElement.getElementsByTagName('views')[0];
	this.views = [];
	this.views.default = this.reader.getString(views,'default');

		for (var i = 0; i < views.children.length; i++) {
			var id = this.reader.getString(views.children[i], 'id', true);
			var near = this.reader.getFloat(views.children[i], 'near', true);
			var far = this.reader.getFloat(views.children[i], 'far', true);
			var fov = this.reader.getFloat(views.children[i], 'angle', true);
			var position = this.getXYZ(views.children[i].children[0], true);
			var target = this.getXYZ(views.children[i].children[1], true);
			var cam = new CGFcamera(fov, near, far, position, target);
			cam.id = id;
			this.views.push(cam);
		}
};


/**
 * Parses scene illumination from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseIllumination = function (rootElement) {
	var illumination = rootElement.getElementsByTagName("illumination")[0];
	var ambient = illumination.getElementsByTagName('ambient')[0];
	var background = illumination.getElementsByTagName('background')[0];
	this.ambientLight = this.getRGBA(ambient, true);
	this.background = this.getRGBA(background, true);
};


/**
 * Parses scene lights fromm the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseLights = function (rootElement) {
	var lights = rootElement.getElementsByTagName('lights')[0];
	{
		var omniLights = lights.getElementsByTagName('omni');
		for (var i = 0; i < omniLights.length; i++) {
			var light = omniLights[i];
			var id = this.reader.getString(light, 'id', true);
			var enabled = this.reader.getBoolean(light, 'enabled', true);
			var locationElem = light.getElementsByTagName('location')[0];
			var ambientElem = light.getElementsByTagName('ambient')[0];
			var diffuseElem = light.getElementsByTagName('diffuse')[0];
			var specularElem = light.getElementsByTagName('specular')[0];

			var location = this.getXYZ(locationElem, true);
			var ambient = this.getRGBA(ambientElem, true);
			var diffuse = this.getRGBA(diffuseElem, true);
			var specular = this.getRGBA(specularElem, true);
			var homogeneous = this.reader.getFloat(locationElem, 'w', true);

			var lightObj = {
				id: id,
				type: 'omni',
				enabled: enabled,
				position: location,
				ambient: ambient,
				diffuse: diffuse,
				specular: specular,
				homogeneous: homogeneous
			};

			this.omniLights.push(lightObj);
		}
	}

	{
		var spotLights = lights.getElementsByTagName('spot');
		for (var i = 0; i < spotLights.length; i++) {
			var light = spotLights[i];
			var id = this.reader.getString(light, 'id', true);
			var enabled = this.reader.getBoolean(light, 'enabled', true);
			var angle = this.reader.getFloat(light, 'angle', true) * Math.PI / 180;
			var exponent = this.reader.getFloat(light, 'exponent', true);
			var targetElem = light.getElementsByTagName('target')[0];
			var locationElem = light.getElementsByTagName('location')[0];
			var ambientElem = light.getElementsByTagName('ambient')[0];
			var diffuseElem = light.getElementsByTagName('diffuse')[0];
			var specularElem = light.getElementsByTagName('specular')[0];

			var location = this.getXYZ(locationElem, true);
			var ambient = this.getRGBA(ambientElem, true);
			var diffuse = this.getRGBA(diffuseElem, true);
			var specular = this.getRGBA(specularElem, true);
			var target = this.getXYZ(targetElem, true);

			var direction = [target[0] - location[0],
			target[1] - location[1],
			target[2] - location[2]];

			var lightObj = {
				id: id,
				type: 'spot',
				enabled: enabled,
				position: location,
				ambient: ambient,
				diffuse: diffuse,
				specular: specular,
				homogeneous: 1,
				exponent: exponent,
				cutOff: angle,
				direction: direction
			};

			this.spotLights.push(lightObj);
		}
	}
};


/**
 * Parses scene textures from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseTextures = function (rootElement) {
	var texturesElem = rootElement.getElementsByTagName('textures')[0];
	var textures = texturesElem.getElementsByTagName('texture');

	for (var i = 0; i < textures.length; i++) {
		var id = this.reader.getString(textures[i], 'id', true);
		var file = "./scenes" + this.reader.getString(textures[i], 'file', true);
		var length_s = this.reader.getFloat(textures[i], 'length_s', true);
		var length_t = this.reader.getFloat(textures[i], 'length_t', true);
		var texture = new CGFtexture(this.scene, file);
		texture.id = id;
		texture.length_s = length_s;
		texture.length_t = length_t;
		this.textures.push(texture);
	}
};


/**
 * Parses scene materials from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseMaterials = function (rootElement) {
	var materialsElem = rootElement.getElementsByTagName('materials')[0];
	var materials = materialsElem.getElementsByTagName('material');

	for (var i = 0; i < materials.length; i++) {
		var id = this.reader.getString(materials[i], 'id', true);
		var emissionElem = materials[i].getElementsByTagName('emission')[0];
		var ambientElem = materials[i].getElementsByTagName('ambient')[0];
		var diffuseElem = materials[i].getElementsByTagName('diffuse')[0];
		var specularElem = materials[i].getElementsByTagName('specular')[0];
		var shininessElem = materials[i].getElementsByTagName('shininess')[0];

		var material = {};
		material.id = id;
		material.emission = this.getColorFromRGBA(emissionElem, true);
		material.ambient = this.getColorFromRGBA(ambientElem, true);
		material.diffuse = this.getColorFromRGBA(diffuseElem, true);
		material.specular = this.getColorFromRGBA(specularElem, true);
		material.shininess = this.reader.getFloat(shininessElem, 'value', true);

		this.materials.push(material);
	}
};


/**
 * Parses scene geometric transformations from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */
graph.prototype.parseTransformations = function (rootElement) {
	var transformationsElem = rootElement.getElementsByTagName('transformations')[0];
	var transformations = transformationsElem.getElementsByTagName('transformation');

	for (var i = 0; i < transformations.length; i++) {
		var ID = this.reader.getString(transformations[i], 'id', true);

		var translateElem = transformations[i].getElementsByTagName('translate')[0];
		if (translateElem != null) {
			var translateToSend = {};
			translateToSend.id = ID;
			translateToSend.type = "translate";
			translateToSend.x = this.reader.getFloat(translateElem, 'x', true);
			translateToSend.y = this.reader.getFloat(translateElem, 'y', true);
			translateToSend.z = this.reader.getFloat(translateElem, 'z', true);
			this.transformations.push(translateToSend);
		}

		var rotateElem = transformations[i].getElementsByTagName('rotate')[0];
		if (rotateElem != null) {
			var rotationToSend = {};
			rotationToSend.id = ID;
			rotationToSend.type = "rotate";
			rotationToSend.axis = this.reader.getString(rotateElem, 'axis', true);
			rotationToSend.angle = this.reader.getFloat(rotateElem, 'angle', true);
			this.transformations.push(rotationToSend);
		}

		var scaleElem = transformations[i].getElementsByTagName('scale')[0];
		if (scaleElem != null) {
			var scaleToSend = {};
			scaleToSend.id = ID;
			scaleToSend.type = "scale;"
			scaleToSend.x = this.reader.getFloat(scaleElem, 'x', true);
			scaleToSend.y = this.reader.getFloat(scaleElem, 'y', true);
			scaleToSend.z = this.reader.getFloat(scaleElem, 'z', true);
			this.transformations.push(scaleToSend);
		}
	}
};

/**
 * Parses scene primitives from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 */

graph.prototype.parsePrimitives = function (rootElement) {
	var primitivesElem = rootElement.getElementsByTagName('primitives')[0];
	var primitives = primitivesElem.children;

	for (var i = 0; i < primitives.length; i++) {
		var id = this.reader.getString(primitives[i], 'id', true);
		var primitive = primitives[i].children[0];

		switch(primitive.tagName){
			case "piece":
			var piece = {};
			piece.id = id;
			piece.type = "piece";
			piece.directions = [];
			piece.directions = this.reader.getRGBA(primitive, 'directions', true);
			this.primitives.push(piece);
			break;

			case "chessboard":
			var chessboard = {};
			chessboard.id = id;
			chessboard.type = "chessboard";
			chessboard.du = this.reader.getInteger(primitive, 'du', true);
			chessboard.dv = this.reader.getInteger(primitive, 'dv', true);
			var textureref = this.reader.getString(primitive, 'textureref', true);
			chessboard.texture = null;
			for(var i = 0; i < this.textures.length; i++)
				if(this.textures[i].id == textureref){
					chessboard.texture = this.textures[i];
					break;
				}
			chessboard.su = this.reader.getInteger(primitive, 'su', true);
			chessboard.sv = this.reader.getInteger(primitive, 'sv', true);
			chessboard.c1 = [];
			chessboard.c1.push(
				this.reader.getFloat(primitive.children[0],'r',true),
					this.reader.getFloat(primitive.children[0],'g',true),
					this.reader.getFloat(primitive.children[0],'b',true),
					this.reader.getFloat(primitive.children[0],'a',true)
			);
			chessboard.c2 = [];
			chessboard.c2.push(
				this.reader.getFloat(primitive.children[1],'r',true),
					this.reader.getFloat(primitive.children[1],'g',true),
					this.reader.getFloat(primitive.children[1],'b',true),
					this.reader.getFloat(primitive.children[1],'a',true)
			);
			chessboard.cs = [];
			chessboard.cs.push(
				this.reader.getFloat(primitive.children[2],'r',true),
					this.reader.getFloat(primitive.children[2],'g',true),
					this.reader.getFloat(primitive.children[2],'b',true),
					this.reader.getFloat(primitive.children[2],'a',true)
			);
			this.primitives.push(chessboard);
			break;

			case "rectangle":
			var rectangle = {};
			rectangle.id = id;
			rectangle.type = "rectangle";
			rectangle.x1 = this.reader.getFloat(primitive, 'x1', true);
			rectangle.y1 = this.reader.getFloat(primitive, 'y1', true);
			rectangle.x2 = this.reader.getFloat(primitive, 'x2', true);
			rectangle.y2 = this.reader.getFloat(primitive, 'y2', true);
			this.primitives.push(rectangle);
			break;

			case "triangle":
			var triangle = {};
			triangle.id = id;
			triangle.type = "triangle";
			triangle.x1 = this.reader.getFloat(primitive, 'x1', true);
			triangle.y1 = this.reader.getFloat(primitive, 'y1', true);
			triangle.z1 = this.reader.getFloat(primitive, 'z1', true);
			triangle.x2 = this.reader.getFloat(primitive, 'x2', true);
			triangle.y2 = this.reader.getFloat(primitive, 'y2', true);
			triangle.z2 = this.reader.getFloat(primitive, 'z2', true);
			triangle.x3 = this.reader.getFloat(primitive, 'x3', true);
			triangle.y3 = this.reader.getFloat(primitive, 'y3', true);
			triangle.z3 = this.reader.getFloat(primitive, 'z3', true);
			this.primitives.push(triangle);
			break;

			case "torus":
			var torus = {};
			torus.id = id;
			torus.type = "torus";
			torus.inner = this.reader.getFloat(primitive, 'inner', true);
			torus.outer = this.reader.getFloat(primitive, 'outer', true);
			torus.slices = this.reader.getFloat(primitive, 'slices', true);
			torus.loops = this.reader.getFloat(primitive, 'loops', true);
			this.primitives.push(torus);
			break;

			case "sphere":
			var sphere = {};
			sphere.id = id;
			sphere.type = "sphere";
			sphere.radius = this.reader.getFloat(primitive, 'radius', true);
			sphere.slices = this.reader.getFloat(primitive, 'slices', true);
			sphere.stacks = this.reader.getFloat(primitive, 'stacks', true);
			this.primitives.push(sphere);
			break;

			case "cylinder":
			var cylinder = {};
			cylinder.id = id;
			cylinder.type = "cylinder";
			cylinder.base = this.reader.getFloat(primitive, 'base', true);
			cylinder.top = this.reader.getFloat(primitive, 'top', true);
			cylinder.height = this.reader.getFloat(primitive, 'height', true);
			cylinder.slices = this.reader.getFloat(primitive, 'slices', true);
			cylinder.stacks = this.reader.getFloat(primitive, 'stacks', true);
			this.primitives.push(cylinder);
			break;

			case "plane":
			var plane = {};
			plane.id = id;
			plane.type = "plane";
			plane.dimX = this.reader.getFloat(primitive, 'dimX', true);
			plane.dimY = this.reader.getFloat(primitive, 'dimY', true);
			plane.partsX = this.reader.getFloat(primitive, 'partsX', true);
			plane.partsY = this.reader.getFloat(primitive, 'partsY', true);
			this.primitives.push(plane);
			break;

			case "patch":
			var patch = {};
			patch.id = id;
			patch.type = "patch";
			patch.orderU = this.reader.getFloat(primitive, 'orderU', true);
			patch.orderV = this.reader.getFloat(primitive, 'orderV', true);
			patch.partsU = this.reader.getFloat(primitive, 'partsU', true);
			patch.partsV = this.reader.getFloat(primitive, 'partsV', true);
			patch.controlPoints = [];
			for(var j = 0; j < patch.orderU + 1; j++){
				var degreePoints = [];
				for(var k = 0; k < patch.orderV + 1; k++){
					var index = j*(patch.orderV + 1)+k;
					var controlPoint = [];
					controlPoint.push(this.reader.getFloat(primitive.children[index], 'x', true));
					controlPoint.push(this.reader.getFloat(primitive.children[index], 'y', true));
					controlPoint.push(this.reader.getFloat(primitive.children[index], 'z', true));
					controlPoint.push(1);
					degreePoints.push(controlPoint);
				}
				patch.controlPoints.push(degreePoints);
			}
			this.primitives.push(patch);
			break;

			case "vehicle":
			var vehicle = {};
			vehicle.id = id;
			vehicle.type = "vehicle";
			this.primitives.push(vehicle);
			break;

			default:
			console.log("Invalid primitive type: " + primitive.tagName);
			break;
		}
	}
};


/**
 * Parses scene nodes from the .dsx file
 *
 * @param  {type} rootElement DOM object with the root node of the file
 * @return {type} Node object with the root scene node information
 */
graph.prototype.parseNodes = function (rootElement) {
	var componentsElem = rootElement.getElementsByTagName('components')[0];
	var components = componentsElem.getElementsByTagName('component');
	var rootComponent = this.getComponentFromId(components, this.rootNodeId);
	rootComponent.id = this.rootNodeId;
	if (this.rootNodeId == null) return "Root node not found!";

	var doubleId = this.checkForDoubleId(components);
	if (doubleId != null)
	return doubleId;

	this.rootNode = this.parseNode(components, rootComponent, null);

	if (typeof this.rootNode === 'string' || this.rootNode instanceof String)
	return this.rootNode;
};


/**
 * Parses a scene node from the .dsx file
 *
 * @param  {type} componentsList Array of DOM objects with the component nodes from the file
 * @param  {type} component      DOM object with the component information to parse
 * @param  {type} parentNode     Node object parsed from the parent of the component parameter
 * @return {type}                Node object parsed from the component parameter
 */
graph.prototype.parseNode = function (componentsList, component, parentNode) {
	var node = new Node(component.id);

	{
		var transformations = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		];

		var transformationElem = component.getElementsByTagName('transformation')[0].childNodes;
		for (var j = 0; j < transformationElem.length; j++) {
			if (transformationElem[j].nodeName == "translate") {
				var x = this.reader.getFloat(transformationElem[j], 'x', true);
				var y = this.reader.getFloat(transformationElem[j], 'y', true);
				var z = this.reader.getFloat(transformationElem[j], 'z', true);
				this.applyTransform("translate", transformations, x, y, z, null, null);
			} else if (transformationElem[j].nodeName == "rotate") {
				var axis = this.reader.getString(transformationElem[j], 'axis', true);
				var angle = this.reader.getFloat(transformationElem[j], 'angle', true);
				this.applyTransform("rotate", transformations, null, null, null, axis, angle);
			} else if (transformationElem[j].nodeName == "scale") {
				var x = this.reader.getFloat(transformationElem[j], 'x', true);
				var y = this.reader.getFloat(transformationElem[j], 'y', true);
				var z = this.reader.getFloat(transformationElem[j], 'z', true);
				this.applyTransform("scale", transformations, x, y, z, null, null);
			} else if (transformationElem[j].nodeName == "transformationref") {
				var id = this.reader.getString(transformationElem[j], 'id', true);
				for (var k = 0; k < this.transformations.length; k++)
				if (this.transformations[k].id == id) {
					this.applyTransform(this.transformations[k].type, transformations,
						this.transformations[k].x, this.transformations[k].y, this.transformations[k].z,
						this.transformations[k].axis, this.transformations[k].angle);
						break;
					}
				}
			}

			node.mat = transformations;
		}

		{
			var materialsElem = component.getElementsByTagName('materials')[0].childNodes;

			if (materialsElem == null)
			return "Can't"

			if (materialsElem.length < 2)
			return "component '" + component.id + "' needs to have at least one material!";

			for (var i = 0; i < materialsElem.length; i++) {
				if (materialsElem[i].nodeName != "material")
				continue;

				var materialId = this.reader.getString(materialsElem[i], 'id', true);
				if (materialId == 'inherit') {
					if (parentNode == null)
					return "Root can't inherit materials";

					var parentMaterials = parentNode.materials;
					for (var j = 0; j < parentMaterials.length; j++) {

						for (var k = 0; k < this.materials.length; k++)
						if (this.materials[k].id == parentMaterials[j].id) {
							var materialRef = this.materials[k];
							var material = new CGFappearance(this.scene);
							material.id = parentMaterials[j].id;
							material.setEmission(
								materialRef.emission.r,
								materialRef.emission.g,
								materialRef.emission.b,
								materialRef.emission.a
							);
							material.setAmbient(
								materialRef.ambient.r,
								materialRef.ambient.g,
								materialRef.ambient.b,
								materialRef.ambient.a
							);
							material.setDiffuse(
								materialRef.diffuse.r,
								materialRef.diffuse.g,
								materialRef.diffuse.b,
								materialRef.diffuse.a
							);
							material.setSpecular(
								materialRef.specular.r,
								materialRef.specular.g,
								materialRef.specular.b,
								materialRef.specular.a
							);
							material.setShininess(materialRef.shininess);
							node.materials.push(material);
						}
					}
				} else {
					for (var j = 0; j < this.materials.length; j++)
					if (this.materials[j].id == materialId) {
						var materialRef = this.materials[j];
						var material = new CGFappearance(this.scene);
						material.id = materialId;
						material.setEmission(
							materialRef.emission.r,
							materialRef.emission.g,
							materialRef.emission.b,
							materialRef.emission.a
						);
						material.setAmbient(
							materialRef.ambient.r,
							materialRef.ambient.g,
							materialRef.ambient.b,
							materialRef.ambient.a
						);
						material.setDiffuse(
							materialRef.diffuse.r,
							materialRef.diffuse.g,
							materialRef.diffuse.b,
							materialRef.diffuse.a
						);
						material.setSpecular(
							materialRef.specular.r,
							materialRef.specular.g,
							materialRef.specular.b,
							materialRef.specular.a
						);
						material.setShininess(materialRef.shininess);
						node.materials.push(material);
					}
				}
			}
		}

		{
			var textureElem = component.getElementsByTagName('texture')[0];
			var textureId = this.reader.getString(textureElem, 'id', true);

			if (textureId == "inherit") {
				if (parentNode == null)
				return "Root node can't inherit a texture";
				node.setTexture(parentNode.texture);
			} else if (textureId != "none")
			for (var i = 0; i < this.textures.length; i++) {
				if (this.textures[i].id == textureId) {
					node.setTexture(this.textures[i]);
					break;
				}
			}
		}

		{
			var childrenElem = component.getElementsByTagName('children')[0];

			var componentsRef = childrenElem.getElementsByTagName('componentref');
			for (var i = 0; i < componentsRef.length; i++) {
				var componentId = this.reader.getString(componentsRef[i], 'id', true);
				var newComponent = this.getComponentFromId(componentsList, componentId);
				newComponent.id = componentId;
				var child = this.parseNode(componentsList, newComponent, node);
				if (typeof child === 'string' || child instanceof String)
				return child;

				node.children.push(child);
			}

			var primitiveref = childrenElem.getElementsByTagName('primitiveref');
			var primitives = [];
			for (var i = 0; i < primitiveref.length; i++) {
				var primitiveId = this.reader.getString(primitiveref[i], 'id', true);

				for (var j = 0; j < this.primitives.length; j++) {
					if (primitiveId == this.primitives[j].id) {
						/*
						if(this.primitives[j].type == 'chessboard'){
							this.primitives[j].texture = node.materials[0];
							if(this.primitives[j].texture != null)
							this.primitives[j].texture.loadTexture(this.primitives[j].textureref);
						}
						*/
						if (node.texture != null)
						node.primitive =
						this.generatePrimitive(
							this.primitives[j],
							node.texture.length_s,
							node.texture.length_t
						);
						else
						node.primitive =
						this.generatePrimitive(
							this.primitives[j],
							1,
							1
						);
						break;
					}
				}
			}
		}
		var animationElem = component.getElementsByTagName('animation')[0];
		var animations = [];
		if(animationElem != null){
			for(var i = 0; i < animationElem.children.length; i++){
				var animationId = this.reader.getString(animationElem.children[i],'id',true);

				for(var j = 0; j < this.animations.length; j++){
					if(this.animations[j].id == animationId){
						animations.push(this.generateAnimation(this.animations[j]));
						break;
					}
				}

			}
		}
		node.animations = animations;

		return node;
	}


	/**
	 * Generates an Animation object from a structure containing
	 * the needed information (span, type, etc.)
	 *
	 * @param  {type} animation Structure with the animation's information
	 * @return {type}           Animation object
	 */
	graph.prototype.generateAnimation = function(animation){
		switch(animation.type){
			case "linear":
			return new LinearAnimation(
				this.scene,
				animation.span,
				animation.control_points
			);
			case "circular":
			return new CircularAnimation(
				this.scene,
				animation.span,
				animation.center[0],
				animation.center[1],
				animation.center[2],
				animation.radius,
				animation.startang,
				animation.rotang
			);
			default:
			console.warn("Invalid animation type!" + animation);
			break;
		}
	}


	/**
	 * Handles the event of a parsing error
	 *
	 * @param  {type} message Message to be displayed on error
	 */
	graph.prototype.onXMLError = function (message) {
		console.error("XML Loading Error: " + message);
		this.loadedOk = false;
	};


	/**
	 * Searches array for a component structure with a certain id
	 *
	 * @param  {type} list Array of component structures
	 * @param  {type} id   Id of the structure to found
	 * @return {type}      Component structure if found, null otherwise
	 */
	graph.prototype.getComponentFromId = function (list, id) {
		for (var i = 0; i < list.length; i++) {
			var component = list[i];
			var componentId = this.reader.getString(component, 'id', true);
			if (componentId == id)
			return component;
		}
	}


	/**
	 * Parses RGBA values into an array from a DOM element
	 *
	 * @param  {type} element  DOM element to be parsed
	 * @param  {type} required True if all 4 RGBA values are required to exist, false otherwise
	 * @return {type}          Array[4] with the RGBA values
	 */
	graph.prototype.getRGBA = function (element, required) {
		var r = this.reader.getFloat(element, 'r', required);
		var g = this.reader.getFloat(element, 'g', required);
		var b = this.reader.getFloat(element, 'b', required);
		var a = this.reader.getFloat(element, 'a', required);
		return vec4.fromValues(r, g, b, a);
	};


	/**
	 * Parses RGBA values into a structure from a DOM element
	 *
	 * @param  {type} element  DOM element to be parsed
	 * @param  {type} required True if all 4 RGBA values are required to exist, false otherwise
	 * @return {type}          Structure with the RGBA values
	 */
	graph.prototype.getColorFromRGBA = function (element, required) {
		var color = {};
		color.r = this.reader.getFloat(element, 'r', required);
		color.g = this.reader.getFloat(element, 'g', required);
		color.b = this.reader.getFloat(element, 'b', required);
		color.a = this.reader.getFloat(element, 'a', required);
		return color;
	};


	/**
	 * Parses XYZ values into an array from a DOM element
	 *
	 * @param  {type} element  DOM element to be parsed
	 * @param  {type} required True if all 3 XYZ values are required to exist, false otherwise
	 * @return {type}          Array[3] with the XYZ values
	 */
	graph.prototype.getXYZ = function (element, required) {
		var x = this.reader.getFloat(element, 'x', false);
		var y = this.reader.getFloat(element, 'y', false);
		var z = this.reader.getFloat(element, 'z', false);
		if(x == null || y == null || z == null){
			x = this.reader.getFloat(element, 'xx', false);
			y = this.reader.getFloat(element, 'yy', false);
			z = this.reader.getFloat(element, 'zz', false);
		}

		return vec3.fromValues(x, y, z);
	};


	/**
	 * Generate a primitive object from a primitive structure
	 *
	 * @param  {type} primitiveInfo Structure with the primitive information
	 * @param  {type} length_s      Float[0..1] with the s texture mapping length
	 * @param  {type} length_t      Float[0..1] with the t texture mapping length
	 * @return {type}               Primitive object
	 */
	graph.prototype.generatePrimitive = function (primitiveInfo, length_s, length_t) {

		switch(primitiveInfo.type){
			case "piece":
			return new piece(
				this.scene,
				primitiveInfo.directions,
				length_s,
				length_t
			);
			case "chessboard":
			return new chessboard(
				this.scene,
				primitiveInfo.du,
				primitiveInfo.dv,
				primitiveInfo.texture,
				primitiveInfo.su,
				primitiveInfo.sv,
				primitiveInfo.c1,
				primitiveInfo.c2,
				primitiveInfo.cs,
				length_s,
				length_t
			);
			case "plane":
			return new plane(
				this.scene,
				primitiveInfo.dimX,
				primitiveInfo.dimY,
				primitiveInfo.partsX,
				primitiveInfo.partsY,
				length_s,
				length_t
			);
			case "patch":
			return new patch(
				this.scene,
				primitiveInfo.orderU,
				primitiveInfo.orderV,
				primitiveInfo.partsU,
				primitiveInfo.partsV,
				primitiveInfo.controlPoints,
				length_s,
				length_t
			);
			case "vehicle":
			return new vehicle(
				this.scene,
				length_s,
				length_t
			);
			case "rectangle":
			return new rectangle(
				this.scene,
				primitiveInfo.x1,
				primitiveInfo.y1,
				primitiveInfo.x2,
				primitiveInfo.y2,
				length_s,
				length_t
			);

			case "triangle":
			return new triangle(
				this.scene,
				primitiveInfo.x1,
				primitiveInfo.y1,
				primitiveInfo.z1,
				primitiveInfo.x2,
				primitiveInfo.y2,
				primitiveInfo.z2,
				primitiveInfo.x3,
				primitiveInfo.y3,
				primitiveInfo.z3,
				length_s,
				length_t
			);
			case "cylinder":
			return new cylinder(
				this.scene,
				primitiveInfo.base,
				primitiveInfo.top,
				primitiveInfo.height,
				primitiveInfo.slices,
				primitiveInfo.stacks,
				length_s,
				length_t
			);
			case "sphere":
			return new sphere(
				this.scene,
				primitiveInfo.radius,
				primitiveInfo.slices,
				primitiveInfo.stacks,
				length_s,
				length_t
			);
			case "torus":
			return new torus(
				this.scene,
				primitiveInfo.inner,
				primitiveInfo.outer,
				primitiveInfo.slices,
				primitiveInfo.loops,
				length_s,
				length_t
			);
		}
	}


	/**
	 * Checks if all components have an unique id
	 *
	 * @param  {type} components Array of DOM component elements
	 */
	graph.prototype.checkForDoubleId = function (components) {
		var idCollection = [];

		for (var i = 0; i < components.length; i++)
		idCollection.push(this.reader.getString(components[i], 'id', true));

		for (var i = 0; i < idCollection.length; i++)
		for (var j = i + 1; j < idCollection.length; j++)
		if (idCollection[i] == idCollection[j])
		return "there are components with the same id: '" + idCollection[i] + "'!";
	}


	/**
	 * Applies a new geometric transformation to an array
	 * of transformation matrixes.
	 *
	 *
	 * @param  {type} type            String name with the type of transformation (rotate, translate, scale)
	 * @param  {type} transformations Array os matrixes to be transformed
	 * @param  {type} x               Float with x value for the transformation
	 * @param  {type} y               Float with y value for the transformation
	 * @param  {type} z               Float with z value for the transformation
	 * @param  {type} axis            Float with x value in case of a rotation
	 * @param  {type} angle           Float with x value in case of a rotation
 */
	graph.prototype.applyTransform = function (type, transformations, x, y, z, axis, angle) {
		switch (type) {
			case "translate":
			mat4.translate(transformations, transformations, [x, y, z]);
			break;
			case "rotate":
			switch (axis) {
				case "x":
				mat4.rotate(transformations, transformations, angle * degToRad, [1, 0, 0]);
				break;
				case "y":
				mat4.rotate(transformations, transformations, angle * degToRad, [0, 1, 0]);
				break;
				case "z":
				mat4.rotate(transformations, transformations, angle * degToRad, [0, 0, 1]);
				break;
			}
			break;
			case "scale":
			mat4.scale(transformations, transformations, [x, y, z]);
			break;
		}
	}
