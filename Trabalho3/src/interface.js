
/**
 * Interface object constructor
 */
function interface() {
	CGFinterface.call(this);
};

interface.prototype = Object.create(CGFinterface.prototype);
interface.prototype.constructor = interface;


/**
 * Initiates interface with default values
 *
 * @param  {type} application CGFapplication object
 * @return {type}             Allways returns true
 */
interface.prototype.init = function (application) {
	
	CGFinterface.prototype.init.call(this, application);
	
	this.gui = new dat.GUI();
	var f1 = this.gui.addFolder('New Game');
	f1.add(this,'start_game_pvp').name('Player vs Player');
	f1.add(this,'start_game_pvb').name('Player vs AI');
	f1.add(this,'start_game_bvb').name('AI vs AI');
	
	var f2 = this.gui.addFolder('Set Difficulty');
	f2.add(this,'set_difficulty_random').name('Random');
	f2.add(this,'set_difficulty_greedy').name('Greedy');
	
	var f3 = this.gui.addFolder('Set Scene');
	f3.add(this,'set_scene_none').name('None');
	f3.add(this,'set_scene_beach').name('Beach');
	// f2.add(this,'set_difficulty_greedy').name('Greedy');
	
	this.gui.add(this,'undo').name('Undo (CTRL-Z)');
	this.gui.add(this,'replay').name('Replay Game');
	
	return true;
}

interface.prototype.set_scene_beach = function(){ 
var filename = getUrlVars()['file'] || "../res/dsx/beach.dsx";
this.scene.set_graph(filename);
};

interface.prototype.set_scene_none = function(){ 
var filename = getUrlVars()['file'] || "../res/dsx/test.dsx";
this.scene.set_graph(filename);
};

interface.prototype.replay = function(){ this.scene.game.start_replay();}

interface.prototype.undo = function(){ this.scene.game.undo();}

interface.prototype.start_game_pvp = function(){
	this.scene.game.set_players('human','human');
}
interface.prototype.start_game_pvb = function(){
	this.scene.game.set_players('human','bot');
}
interface.prototype.start_game_bvb = function(){
	this.scene.game.set_players('bot','bot');
}

interface.prototype.set_difficulty_random = function(){
	this.scene.game.set_difficulty(0);
}

interface.prototype.set_difficulty_greedy = function(){
	this.scene.game.set_difficulty(1);
}


interface.prototype.processKeyDown = function(event){	
	switch(event.keyCode){		
		case 90:
		if(event.ctrlKey)
			this.scene.game.undo();
		break;
		case 37:
		this.scene.game.current_player().rotate_play(1);
		break;
		case 39:
		this.scene.game.current_player().rotate_play(0);
		break;
	}
}
