function player(type,team,game){
	this.type = type;
	this.team = team;
	this.play = null;
	this.game = game;
	this.picked = 0;
	this.highlighted = [];
}

player.prototype.constructor = player;

player.prototype.rotate_play = function(angle){

	var coord = picking_id_to_coord(this.picked);	
	var piece = this.game.board[coord[0]][coord[1]];
	if(piece[0] == this.team)
		this.play = {x:coord[0], y:coord[1], displacement:0, orientation:angle};
	
	else
		this.play = null;

};

player.prototype.picking_play = function(){
	
	var new_picked = this.game.picked;
	
	if(this.picked == new_picked) return;
	
	var new_coord = picking_id_to_coord(new_picked);
	
	var index = -1;
	for(var i = 0; i < this.highlighted.length; i++)
		if(	this.highlighted[i][0] == new_coord[0] && 
			this.highlighted[i][1] == new_coord[1]){
			index = i;
			break;
		}
	
	if(index == -1){
		this.picked = new_picked;
		this.highlighted = this.game.highlighted.slice();
		this.play = null;
	}
	else{
		
		
		var old_coord = picking_id_to_coord(this.picked);
		var disp =
		Math.max(
		Math.abs(new_coord[0]-old_coord[0]),
		Math.abs(new_coord[1]-old_coord[1])
		);
		var orient = '';
		if(new_coord[0] > old_coord[0])
			orient += 's';
		else if(new_coord[0] < old_coord[0])
			orient += 'n';
		if(new_coord[1] > old_coord[1])
			orient += 'e';
		else if(new_coord[1] < old_coord[1])
			orient += 'w';
		this.play = {
			x:old_coord[0],
			y:old_coord[1],
			displacement:disp,
			orientation:orient
		};
		this.picked = 0;
		this.highlighted = [];
		console.log('valid play:');
		console.log(this.play);
	}
};


player.prototype.get_input = function(){
	
	//picking function will generate the play struct	
	switch(this.type){
		
		case 'human':
		return this.play !== null;		
		
		case 'bot':
		return true;
		
	}	
};

player.prototype.play_to_string = function(play){

	switch(this.type){
		
		case 'human':
		return 'human_play(' +
		play.x +
		',' +
		play.y +
		',' +
		play.orientation +
		',' +
		play.displacement +
		',' +
		this.team +
		')';
		
		case 'bot':
		return 'bot_play(' +
		this.team +
		')';
		
	}
};

player.prototype.play_handler = function(){
	console.log('play_handler: ' + request_response);	
	if(request_response){
	eval(request_response);
	this.play = play;
	request_response = null;
	}
};

player.prototype.make_play = function(){
	
	var request = this.type + '_play(';
	
	if(this.type ==  'human'){
		request += this.play.x;
		request += ',';
		request += this.play.y;
		request += ',';
		request += this.play.orientation;
		request += ',';
		request += this.play.displacement;
		request += ',';
	}
	
	request += this.team + ')';
	
	console.log(request);
	get_request(request);
	
	this.play = null;
	
};