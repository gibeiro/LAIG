var degToRad = Math.PI / 180.0;

function graph(filename, scene) {
	this.loadedOk = null;
	this.scene = scene;
	scene.graph = this;
	this.reader = new CGFXMLreader();
	this.reader.open(filename, this);
}
graph.prototype.constructor = graph;

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

graph.prototype.validateOrder = function (rootElement) {
	var nodes = rootElement.childNodes;
	var types = [];
	var names = ['scene', 'views', 'illumination', 'lights', 'textures',
	'materials', 'transformations', 'primitives', 'components'];

	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType == 1) {
			types.push(nodes[i]);
			console.info(nodes[i]);
		}
	}

	if (types.length < 9) {
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
			if (!found) {
				missingNodes.push([names[name]]);
			}
		}
		var errorText = "XML is missing the following nodes:\n";
		for (var i = 0; i < missingNodes.length; i++)
		errorText += "\t" + missingNodes[i] + ";\n";
		this.onXMLError(errorText + "Aborting!");
		return false;
	} else if (types.length > 9)
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

/*
* Parse the data to the scene
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
};

graph.prototype.parseAnimations = function(rootElement){
	var animations = rootElement.getElementsByTagName('animations')[0];
	for(var i = 0; i < animations.children.length; i++){
			var animation = animations.children[i];

			var id = this.reader.getString(animation,'id');
			var span = this.reader.getFloat(animation,'span');
			var type = this.reader.getItem(animation,'type',['linear','circular']);

		if(type == 'linear'){
			for(var j = 0; j < animation.children.length; j++){
				var controlpoint = animation.children[j];
				var xx = this.reader.getFloat(controlpoint,'xx');
				var yy = this.reader.getFloat(controlpoint,'yy');
				var zz = this.reader.getFloat(controlpoint,'zz');
			}
		}
		else if(type == 'circular'){
			var center = this.reader.getXYZ(animation, 'center');
			var radius = this.reader.getFloat(animation, 'radius');
			var startang = this.reader.getFloat(animation, 'startang');
			var rotang = this.reader.getFloat(animation, 'rotang');
		}
		else
			this.onXMError('invalid animation type');
		}


};

graph.prototype.parseScene = function (rootElement) {
	var scene = rootElement.getElementsByTagName('scene')[0];
	var axisLength = this.reader.getFloat(scene, 'axis_length', true);
	this.rootNodeId = this.reader.getString(scene, 'root', true);
	this.axis = new CGFaxis(this.scene, axisLength, 0.2);

	return null;
};

graph.prototype.parseViews = function (rootElement) {
	var views = rootElement.getElementsByTagName('views')[0];

	{
		var perspCams = views.getElementsByTagName('perpective');
		for (var i = 0; i < perspCams.length; i++) {
			var id = this.reader.getString(perspCams[i], 'id', true);
			var near = this.reader.getFloat(perspCams[i], 'near', true);
			var far = this.reader.getFloat(perspCams[i], 'far', true);
			var fov = this.reader.getFloat(perspCams[i], 'angle', true);
			var fromElem = perspCams[i].getElementsByTagName('from')[0];
			var toElem = perspCams[i].getElementsByTagName('to')[0];
			var position = this.getXYZ(fromElem, true);
			var target = this.getXYZ(toElem, true);
			var cam = new CGFcamera(fov, near, far, position, target);
			cam.id = id;
			this.perspCams.push(cam);
		}
	}
};


graph.prototype.parseIllumination = function (rootElement) {
	var illumination = rootElement.getElementsByTagName("illumination")[0];
	var ambient = illumination.getElementsByTagName('ambient')[0];
	var background = illumination.getElementsByTagName('background')[0];
	this.ambientLight = this.getRGBA(ambient, true);
	this.background = this.getRGBA(background, true);
};

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

graph.prototype.parsePrimitives = function (rootElement) {
	var primitivesElem = rootElement.getElementsByTagName('primitives')[0];
	var primitives = primitivesElem.getElementsByTagName('primitive');

	for (var i = 0; i < primitives.length; i++) {
		var id = this.reader.getString(primitives[i], 'id', true);

		var typeElem = null;
		if ((typeElem = primitives[i].getElementsByTagName('rectangle')[0]) != null) {
			var rectangle = {};
			rectangle.id = id;
			rectangle.type = "rectangle";
			rectangle.x1 = this.reader.getFloat(typeElem, 'x1', true);
			rectangle.y1 = this.reader.getFloat(typeElem, 'y1', true);
			rectangle.x2 = this.reader.getFloat(typeElem, 'x2', true);
			rectangle.y2 = this.reader.getFloat(typeElem, 'y2', true);
			this.primitives.push(rectangle);

		} else if ((typeElem = primitives[i].getElementsByTagName('triangle')[0]) != null) {
			var triangle = {};
			triangle.id = id;
			triangle.type = "triangle";
			triangle.x1 = this.reader.getFloat(typeElem, 'x1', true);
			triangle.y1 = this.reader.getFloat(typeElem, 'y1', true);
			triangle.z1 = this.reader.getFloat(typeElem, 'z1', true);
			triangle.x2 = this.reader.getFloat(typeElem, 'x2', true);
			triangle.y2 = this.reader.getFloat(typeElem, 'y2', true);
			triangle.z2 = this.reader.getFloat(typeElem, 'z2', true);
			triangle.x3 = this.reader.getFloat(typeElem, 'x3', true);
			triangle.y3 = this.reader.getFloat(typeElem, 'y3', true);
			triangle.z3 = this.reader.getFloat(typeElem, 'z3', true);
			this.primitives.push(triangle);

		} else if ((typeElem = primitives[i].getElementsByTagName('cylinder')[0]) != null) {
			var cylinder = {};
			cylinder.id = id;
			cylinder.type = "cylinder";
			cylinder.base = this.reader.getFloat(typeElem, 'base', true);
			cylinder.top = this.reader.getFloat(typeElem, 'top', true);
			cylinder.height = this.reader.getFloat(typeElem, 'height', true);
			cylinder.slices = this.reader.getFloat(typeElem, 'slices', true);
			cylinder.stacks = this.reader.getFloat(typeElem, 'stacks', true);
			this.primitives.push(cylinder);

		} else if ((typeElem = primitives[i].getElementsByTagName('sphere')[0]) != null) {
			var sphere = {};
			sphere.id = id;
			sphere.type = "sphere";
			sphere.radius = this.reader.getFloat(typeElem, 'radius', true);
			sphere.slices = this.reader.getFloat(typeElem, 'slices', true);
			sphere.stacks = this.reader.getFloat(typeElem, 'stacks', true);
			this.primitives.push(sphere);

		} else if ((typeElem = primitives[i].getElementsByTagName('torus')[0]) != null) {
			var torus = {};
			torus.id = id;
			torus.type = "torus";
			torus.inner = this.reader.getFloat(typeElem, 'inner', true);
			torus.outer = this.reader.getFloat(typeElem, 'outer', true);
			torus.slices = this.reader.getFloat(typeElem, 'slices', true);
			torus.loops = this.reader.getFloat(typeElem, 'loops', true);
			this.primitives.push(torus);

		}
	}
};

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

		return node;
	}

	graph.prototype.onXMLError = function (message) {
		console.error("XML Loading Error: " + message);
		this.loadedOk = false;
	};

	graph.prototype.getComponentFromId = function (list, id) {
		for (var i = 0; i < list.length; i++) {
			var component = list[i];
			var componentId = this.reader.getString(component, 'id', true);
			if (componentId == id)
			return component;
		}
	}

	graph.prototype.getRGBA = function (element, required) {
		var r = this.reader.getFloat(element, 'r', required);
		var g = this.reader.getFloat(element, 'g', required);
		var b = this.reader.getFloat(element, 'b', required);
		var a = this.reader.getFloat(element, 'a', required);
		return vec4.fromValues(r, g, b, a);
	};

	graph.prototype.getColorFromRGBA = function (element, required) {
		var color = {};
		color.r = this.reader.getFloat(element, 'r', required);
		color.g = this.reader.getFloat(element, 'g', required);
		color.b = this.reader.getFloat(element, 'b', required);
		color.a = this.reader.getFloat(element, 'a', required);
		return color;
	};

	graph.prototype.getXYZ = function (element, required) {
		var x = this.reader.getFloat(element, 'x', required);
		var y = this.reader.getFloat(element, 'y', required);
		var z = this.reader.getFloat(element, 'z', required);
		return vec3.fromValues(x, y, z);
	};

	graph.prototype.generatePrimitive = function (primitiveInfo, length_s, length_t) {

		switch(primitiveInfo.type){
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
			break;
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
			break;
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
			break;
			case "sphere":
			return new sphere(
				this.scene,
				primitiveInfo.radius,
				primitiveInfo.slices,
				primitiveInfo.stacks,
				length_s,
				length_t
			);
			break;
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
			break;
		};
	}

	graph.prototype.checkForDoubleId = function (components) {
		var idCollection = [];

		for (var i = 0; i < components.length; i++)
		idCollection.push(this.reader.getString(components[i], 'id', true));

		for (var i = 0; i < idCollection.length; i++)
		for (var j = i + 1; j < idCollection.length; j++)
		if (idCollection[i] == idCollection[j])
		return "there are components with the same id: '" + idCollection[i] + "'!";

		return null;
	}

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
