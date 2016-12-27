
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
	
	this.gui.add(this,'undo').name('Undo (CTRL-Z)');
	
	return true;
}

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


interface.prototype.processKeyDown = function(event){	
	switch(event.keyCode){		
		case 90:
		if(event.ctrlKey)
			this.scene.game.undo();
		break;
		case 37:
		this.scene.game.current_player().rotate_play(0);
		break;
		case 39:
		this.scene.game.current_player().rotate_play(1);
		break;
	}
}
