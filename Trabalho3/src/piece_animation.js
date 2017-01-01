function animation_update(time){
	if(!time) time = this.game.time;
	this.time = time;
	
	this.phase = (this.time-this.begin)/this.span;
	
	if(this.phase >= 1) return this.end();
	
	return false;
}

function piece_translate(game,play,multiplier){
	multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
	this.game = game;
	this.scene = game.scene;
	this.init_coord = {x:play.x,y:play.y};
	this.end_coord = end_position(play);
	this.begin = game.time;	
	this.time = 0;
	this.phase = 0;
	console.log(game.pieces);
	this.piece = game.pieces[this.init_coord.x][this.init_coord.y];	
	this.vector = {
		x:this.end_coord.x-this.init_coord.x,
		y:this.end_coord.y-this.init_coord.y
	};
	this.center = {
		x:this.vector.x/2,
		y:-this.vector.y/2
	};
	this.radius = .5*((this.end_coord.x-this.init_coord.x)**2+(this.end_coord.y-this.init_coord.y)**2)**.5;
	this.span = this.radius * 750 * multiplier;
	console.log('center:');
	console.log(this.center);
	// this.center = {
		// x:(this.init_coord.x+this.end_coord.x)/2,
		// y:(this.init_coord.y+this.end_coord.y)/2
	// };
	this.angle = Math.atan(this.vector.y/this.vector.x);	
	
	if(this.vector.x == 0){
		if(this.vector.y > 0)
			this.angle = -Math.PI/2;
		else
			this.angle = Math.PI/2;
	}

	if(this.vector.y == 0){
	  if(this.vector.x < 0)
		this.angle = 0;
	  else
		this.angle = Math.PI;
	}
	
	if(Math.abs(this.vector.x) == Math.abs(this.vector.y))
		if(this.vector.x > 0) this.angle += Math.PI;
	
	console.log('angle: ' + this.angle*180/Math.PI + '\tvector: ' + [this.vector.x,this.vector.y].toString());
	game.pieces[this.init_coord.x][this.init_coord.y] = this;
}
piece_translate.prototype.constructor = piece_translate; 
piece_translate.prototype.set_color = function(rgba){
if(!rgba) rgba = [.6,.6,.6,1];
	this.piece.set_color(rgba);
};
piece_translate.prototype.display = function(){
	console.log('piece_translate_display');
	// this.scene.pushMatrix();	
		
	this.scene.translate(this.center.x,0,this.center.y);
	
	this.scene.rotate(this.angle,0,1,0);
	
	this.scene.translate(
		this.radius*Math.cos(this.phase*Math.PI),
		this.radius*Math.sin(this.phase*Math.PI),
		0
	);	
	
	this.scene.rotate(
		-Math.PI*this.phase*2,
		this.vector.y,
		0,
		-this.vector.x
	);
	
	this.scene.rotate(-this.angle,0,1,0);
	
	this.scene.scale(0.4,0.4,0.4);
	this.piece.display();
	// this.scene.popMatrix();
};
piece_translate.prototype.end = function(){
	this.game.pieces[this.end_coord.x][this.end_coord.y] = this.piece;
	this.game.pieces[this.init_coord.x][this.init_coord.y] = null;
	return true;
};
piece_translate.prototype.update = function(time){
	if(!time) time = this.game.time;
	this.time = time;
	
	this.phase = (this.time-this.begin)/this.span;
	
	if(this.phase >= 1) return this.end();
	
	return false;
};

function piece_rotate(game,play,multiplier){
	multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
	this.game = game;
	this.scene = game.scene;
	this.init_coord = {x:play.x,y:play.y};
	this.begin = game.time;
	this.span = 500 * multiplier;
	this.time = 0;
	this.phase = 0;
	this.piece = game.pieces[this.init_coord.x][this.init_coord.y];
	this.angle = Math.PI/4;
	if(!play.orientation)
		this.angle *= -1;
	game.pieces[this.init_coord.x][this.init_coord.y] = this;
	console.log(this);
}
piece_rotate.prototype.constructor = piece_rotate;
piece_rotate.prototype.update = function(time){
	if(!time) time = this.game.time;
	this.time = time;
	
	this.phase = (this.time-this.begin)/this.span;
	
	if(this.phase >= 1) return this.end();
	
	return false;
};
piece_rotate.prototype.set_color = function(rgba){
if(!rgba) rgba = [.6,.6,.6,1];
	this.piece.set_color(rgba);
};
piece_rotate.prototype.display = function(){
	console.log('rotating: ' + this.angle*this.phase);
	console.log(this.phase);
	// this.scene.pushMatrix();
	this.scene.rotate(this.phase*this.angle,0,1,0);
	this.scene.scale(0.4,0.4,0.4);
	this.piece.display();
	console.log(this.piece);
	// this.scene.popMatrix();
}; 
piece_rotate.prototype.end = function(){
	var increment = 1;
	if(this.angle > 0) increment = 7;
	
	var directions = this.piece.directions;
	for(var i = 0;i < directions.length; i++){
		directions[i] += increment; 
		directions[i] %= 8; 
	}
	this.game.pieces[this.init_coord.x][this.init_coord.y] = this.piece;
	
	return true;
} 


function piece_captured(game,play,multiplier){
	multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
	this.game = game;
	this.scene = game.scene;
	this.init_coord = {x:play.x,y:play.y};
	this.end_coord = end_position(play);
	this.begin = game.time;
	this.time = 0;
	this.phase = 0;
	this.travel = this.radius = ((this.end_coord.x-this.init_coord.x)**2+(this.end_coord.y-this.init_coord.y)**2)**.5;	
	this.span = this.travel*.5*749 * multiplier;
	// var pieces = game.pieces[this.end_coord.x].slice();
	this.piece = game.pieces[this.end_coord.x][this.end_coord.y];
	// this.piece.prototype = game.pieces[this.end_coord.x][this.end_coord.y].prototype;
	game.pieces[this.end_coord.x][this.end_coord.y] = this;
	console.log(this);
}
piece_captured.prototype.constructor = piece_captured; 
piece_captured.prototype.set_color = function(rgba){
if(!rgba) rgba = [.6,.6,.6,1];
	this.piece.set_color(rgba);
};
piece_captured.prototype.update = function(time){
	if(!time) time = this.game.time;
	this.time = time;
	
	this.phase = (this.time-this.begin)/this.span;
	
	if(this.phase >= 1) return this.end();
	
	return false;
};
piece_captured.prototype.display = function(){	
	this.scene.translate(0,this.travel*1.5*Math.sin(1.05*Math.PI*this.phase),0);
	this.scene.rotate(this.travel*Math.PI*this.phase,1,0,0);
	this.scene.scale(0.4,0.4,0.4);
	this.piece.display();
};
piece_captured.prototype.end = function(){
	
	if(this.game.current_player().team == 'red')
		this.game.tray1.push(this.piece);
	else
		this.game.tray2.push(this.piece);
	
	return true;
}; 

function animation_piece_color(rgba){
if(!rgba) rgba = [.6,.6,.6,1];
	this.piece.set_color(rgba);
}