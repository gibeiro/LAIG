function camera_animation(game,angle,multiplier){
	multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
	this.game = game;
	this.scene = game.scene;
	this.time = 0;
	this.phase = 0;
	this.begin = game.time;
	this.span = multiplier * 1500;	
	this.camera = this.game.camera;
	this.angle = 0;
	this.anglef = angle - this.camera.angle;
	game.camera.angle = angle;
	// if(Math.abs(this.vector.x) == Math.abs(this.vector.y))
		// if(this.vector.x > 0) this.angle += Math.PI;
	
	// console.log('camera_animation', this);
}

camera_animation.prototype.constructor = camera_animation;
camera_animation.prototype.display = function(){
	// console.log('camera_animation_display',this.phase);	
	
	var increment = this.current_increment();
	
	this.camera.orbit(this.scene.axis,increment);
	
	this.angle += increment;
	
};

camera_animation.prototype.update = function(time){
	this.time = time;
	
	this.phase = (this.time-this.begin)/this.span;
	
	if(this.phase >= 1) return this.end();
	
	this.display();
	
	return false;
};

camera_animation.prototype.end = function(){
	
	return true;
};

camera_animation.prototype.current_increment = function(){
	
	return Math.sin(this.phase*Math.PI*.5)*this.anglef-this.angle;
};