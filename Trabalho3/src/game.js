function game(scene){
	this.colors = [];
	this.picked = 0;
	this.highlighted = [];
	this.colors.red = [0.8,0.2,0.2,1];
	this.colors.green = [0.2,0.8,0.2,1];
	this.colors.red_highlighted = [0.7,0.1,0.1,1];
	this.colors.green_highlighted = [0.1,0.7,0.1,1];
	this.players = [];
	this.objects = [];
	for(var i = 0; i < 9; i++){
		this.objects.push([]);
		for(var j = 0; j < 9; j++)
			this.objects[i].push(new CGFplane(scene));
	}
  this.scene = scene;
  scene.setPickEnabled(true);
  this.stack = [];
  this.state = 0;
  this.board = [];
  this.chessboard = new chessboard(
    scene,
    9,
    9,
    "t_chessboard",
    -1,
    -1,
    [0.3,0.3,0.3,1],
    [0.7,0.7,0.7,1],
    [1,1,1,1]
  );
	this.pieces = [];
	this.piece = new piece(scene);
	this.tile_colors = [];
	this.tile_colors.push(new CGFappearance(this.scene));	
	this.tile_colors.push(new CGFappearance(this.scene));
	this.tile_colors.push(new CGFappearance(this.scene));
	this.tile_colors.push(new CGFappearance(this.scene));
	this.tile_colors.push(new CGFappearance(this.scene));
	this.tile_colors[0].setAmbient(0.8,0.8,0.8,1);
	this.tile_colors[1].setAmbient(0.2,0.2,0.2,1);	
	this.tile_colors[2].setAmbient(0.2,0.6,1,1);
	this.tile_colors[3].setAmbient(0.16,0.48,0.8,1);
	
 /* this.board = [
[['empty',[]],['green',['w','s','e']],['green',['s','ne','nw']],['green',['sw','s','se']],['green',['sw','se','ne','nw']],['green',['sw','se','s']],['green',['s','ne','nw']],['green',['w','s','e']],['empty',[]]],
[['empty',[]],['empty',[]],['green',['s','se']],['green',['sw','se']],['green',['s','n']],['green',['sw','se']],['green',['sw','s']],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['green',['s']],['green',['s']],['green',['s']],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['red',['n']],['red',['n']],['red',['n']],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['red',['n','ne']],['red',['nw','ne']],['red',['s','n']],['red',['nw','ne']],['red',['nw','n']],['empty',[]],['empty',[]]],
[['empty',[]],['red',['w','n','e']],['red',['n','se','sw']],['red',['nw','n','ne']],['red',['sw','se','ne','nw']],['red',['nw','ne','n']],['red',['n','se','sw']],['red',['w','n','e']],['empty',[]]]];*/
}
game.prototype.constructor = game;

game.prototype.update = function(time){	
	
	// console.log(this.state);
	// console.log(this);
	// console.log(waiting_response);
	// console.log(request_response);	
	// console.log('\n');
	
	switch(this.state){
		
		case 0: //waiting for player to be set
		if(this.players_are_set())
			this.state = 1;
		break;
		
		case 1: //sending board request
		if(!waiting_response){
			get_request('start');
			waiting_response = true;
			this.state = 5;			
		}
		else
			this.state = 2;
		break;
		
		case 2: //waiting for player input
		if(this.current_player().get_input())
			this.state = 3;
		break;
		
		case 3: //sending player input
		if(!waiting_response){
			this.current_player().make_play();
			waiting_response = true;
			this.state = 6;
		}
		break;
		
		case 4: //sending game state request
		if(!waiting_response){
			get_request('is_game_over');
			waiting_response = true;
			this.state = 7;
		}
		break;
		
		case 5: //waiting for board request response
		if(!waiting_response){
			eval(request_response);
			request_response = null;
			this.board = board;
			this.read_pieces();
			this.state = 2;			
		}
		break;
		
		case 6: //waiting for play response
		if(!waiting_response){
			if(request_response == 'Bad Request'){
				this.state = 2;
				request_response = null;
				break;
			}
			eval(request_response);
			request_response = null;
			this.play(play);
			this.highlighted = [];
			this.picked = 0;
			this.state = 4;
		}			
		break;
		
		case 7: //waiting for game state
		if(!waiting_response){
			eval('var bool = ' + request_response);
			request_response = null;
			if(bool){//over
			console.log('Team ' + bool + ' won the game!');
			this.players = [];
			this.state = 0;
			}
			else{//not over
			this.next_player();
			this.state = 2;
			}
		}	
		break;
	}
	
	
};

game.prototype.read_pieces = function(){

	for(var i = 0; i < this.board.length; i++){
		var line = [];
		for(var j = 0; j < this.board[i].length; j++){
			if(this.board[i][j][0] == 'empty') {
				line.push(null);
				continue;
			}
			var _piece = new piece(this.scene);	
			var directions = translate_orientations(this.board[i][j][1]);			
			_piece.set_directions(directions);
			line.push(_piece);
		}
		this.pieces.push(line);
	}

};

game.prototype.set_players = function(type1,type2){	
	this.board = [];
	this.pieces = [];
	this.stack = [];
	this.players = [];
	this.players.push(new player(type1,'red',this));
	this.players.push(new player(type2,'green',this));
	this.players.current = 0;
	this.state = 0;
};

game.prototype.next_player = function(){	
	this.players.current++;
	this.players.current %= this.players.length;
	return this.players[this.players.current];
};

game.prototype.current_player = function(){		
	
	return this.players[this.players.current];
};


game.prototype.undo = function(){
  var play = this.stack.pop();
  
  var coord = end_position(play);
  this.board[play.y][play.x] = this.board[coord[0]][coord[1]];
  this.board[coord[0]][coord[1]] = play.captured;
  
  console.log(this.board.toString());
  
  get_request(this.board.toString());
  waiting_request = true;
  
  this.state = 8;
  
};


function end_position(play){
	
	var dx = play.displacement, dy = dx;
	var coord = {};
	var direction = play.orientation;
	if(direction == 7 || direction == 0 || direction == 1)
		dx *= -1;
	if(direction == 7 || direction == 6 || direction == 5)
		dy *= -1;
	if(direction == 0 || direction == 4)
		dy *= 0;
	else if(direction == 6 || direction == 2)
		dx *= 0;
	
	coord.x=play.x+dx;
	coord.y=play.y+dy;
	
	return coord;
	
}

function rotate_orientations(orientations,angle){	
	
	var directions = orientations.slice();
	var compass = [n,ne,e,se,s,sw,w,nw];
	
	var increment;	
	if(!angle) increment = 1; else increment = compass.length-1;
	
	var index;	
	for(var i = 0; i < directions.length; i++){
		index = compass.indexOf(directions[i]);
		index = (index + increment)%compass.length;
		// console.log('index: ' + index);
		// console.log('b4: ' + directions[i]);
		// console.log('after: ' + compass[index]);
		directions[i] = compass[index];
	}
	// console.log('rotate_orientations');
	// console.log('b4: ' + orientations.toString());
	// console.log('after: ' + directions.toString());
	
	return directions;
	
}

game.prototype.calc_highlights = function(){

	this.highlighted = [];
	
	if(this.picked === 0) return;
	
	var coord = picking_id_to_coord(this.picked);
	this.highlighted.push(coord);		
	
	if(this.board.length === 0) return;	
	
	var picked_piece = this.board[coord[0]][coord[1]];
	
	if(picked_piece[0] != this.current_player().team) return;
	
	for(var i = 0; i < picked_piece[1].length; i++){
		var direction = translate_orientations([picked_piece[1][i]])[0];		
		var displacement = picked_piece[1].length;
		// console.log('direction: '+direction);
		if(displacement == 4) displacement = 1;
		for(var j = 1; j < displacement + 1; j++){
			
			
			var dy,dx;
			dy = dx = j;
			
			if(direction == 7 || direction == 0 || direction == 1)
				dx *= -1;
			if(direction == 7 || direction == 6 || direction == 5)
				dy *= -1;
			if(direction == 0 || direction == 4)
				dy *= 0;
			else if(direction == 6 || direction == 2)
				dx *= 0;
			
			var end_coord = [coord[0]+dx,coord[1]+dy];
			// console.log('end coord: ' + end_coord.toString());
			if(
				end_coord[0] < 0 || 
				end_coord[1] < 0 || 
				end_coord[0] > 8 ||
				end_coord[1] > 8
			) {/*console.log('discarded - out of boudaries');*/break;}
			
			var end_piece = this.board[end_coord[0]][end_coord[1]];
			
			if(end_piece[0] == picked_piece[0]){/*console.log('discarded - collision with team');*/ break;}
			
			this.highlighted.push(end_coord);
			
			if(end_piece[0] != 'empty'){/*console.log('collision with enemy');*/break;}			
			
		}
	}
};

game.prototype.play = function(play){
	
	// console.log('Adding play: ');
	// console.log(play);
	// console.log('Before: ');
	// this.debug_board();
	if(play.displacement === 0){//rotation
		play.captured = null;
		var piece = this.board[play.x][play.y];
		var directions = rotate_orientations(piece[1],play.orientation);
		this.board[play.x][play.y][1] = directions;	
		this.pieces[play.x][play.y].directions = translate_orientations(directions);
		// console.log(directions.toString());
		// console.log(this.pieces[play.x][play.y].directions.toString());
		}
	else{//translation
		var coord = end_position(play);
		// console.log('End position: ');
		// console.log(coord);
		play.captured = this.board[coord.x][coord.y];
		// console.log(play.captured);
		this.board[coord.x][coord.y] = this.board[play.x][play.y];		
		// console.log(this.board[play.x][play.y]);
		this.board[play.x][play.y] = [empty,[]];
		// console.log(this.board[coord.x][coord.y]);
		this.pieces[coord.x][coord.y] = this.pieces[play.x][play.y];
		this.pieces[play.x][play.y] = null;
		
	}
  this.stack.push(play);
  // console.log('After: ');
	// this.debug_board();
  
};

game.prototype.is_game_over_handler = function(){
	
	if(request_response){
	
		eval('var bool = ' + request_response);	
		if(bool) this.state = 0;
		request_response = null;
	
	}	
};

game.prototype.is_game_over = function(){

if(get_request('is_game_over'))
this.is_game_over_handler();

};

game.prototype.start_handler = function(){	

	if(request_response){
		eval(request_response);
		this.board = board;	
		request_response = null;
	}	
};

game.prototype.start = function(){
if(get_request('start'))
this.start_handler();
};

game.prototype.players_are_set = function(){
	
	return this.players[0] && this.players[1];
	
};

function translate_orientations(orientations){

	var directions = orientations.slice();
	var compass = [n,ne,e,se,s,sw,w,nw];
	var index;
	for(var i = 0; i < directions.length; i++){
		index = compass.indexOf(directions[i]);
		directions[i] = index;
	}

	return directions;
}

function picking_id_to_coord(id){
	var coord = [
		Math.floor((id-1)/9),
		(id-1)%9
	];
	
	if(coord[0] > -1 && coord[0] < 9 && coord[1] > -1 && coord[1] < 9)
		return coord;
	else
		return null;
}

function coord_to_picking_id(coord){
	var id = 9*coord[0]+coord[1]+1;
	if(coord[0] > -1 && coord[0] < 9 && coord[1] > -1 && coord[1] < 9)
		return id;
	else
		return null;
}

game.prototype.display_board = function(){

	var highlighted = this.highlighted.slice();
	
	for(var i = 0; i < this.objects.length; i++){
		for(var j = 0; j < this.objects[i].length; j++){
			this.scene.pushMatrix();
			this.scene.translate(i-4,0,4-j);					
			var picking_id = 1+9*i+j;
			var color = this.tile_colors[picking_id%2];
			for(var k = 0; k < highlighted.length; k++)
				if(highlighted[k][0] == i && highlighted[k][1] == j){
					color = this.tile_colors[picking_id%2+2];
					highlighted.splice(k,1);
					break;
				}
			color.apply();
			this.scene.registerForPick(picking_id, this.objects[i][j]);			
			this.objects[i][j].display();
			this.scene.popMatrix();			
		}	
	}
};

game.prototype.display_chessboard = function(){
	
	this.scene.pushMatrix();
  this.scene.scale(9,1,9);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.chessboard.display();
  this.scene.popMatrix();
	
};

game.prototype.display_pieces = function(){
	
	for(var i = 0; i < this.pieces.length; i++){
		for(var j = 0; j < this.pieces[i].length; j++){
		  if(!this.pieces[i][j]) continue;		
		  this.scene.pushMatrix();
		  this.scene.translate(i-4,0,4-j);
		  this.scene.scale(0.4,0.4,0.4);
		  var picking_id = 9*i+j+1;
		  var color_name = this.board[i][j][0];		  
		  if(
		  this.picked == picking_id &&
		  this.current_player().team == color_name
		  )	color_name += '_highlighted';
		  var color = this.colors[color_name];
		  this.pieces[i][j].set_color(color);
		  this.scene.registerForPick(picking_id, this.pieces[i][j]);
		  this.pieces[i][j].display();
		  this.scene.popMatrix();

		}
	}
};

game.prototype.display = function(){

// console.log(this.highlighted);

	this.scene.logPicking();
	this.scene.clearPickRegistration();

  this.display_board();
  this.display_pieces();
};
   
  
/*

  for(var i = 0; i < this.board.length; i++){
    for(var j = 0; j < this.board[i].length; j++){
      if(this.board[i][j][0] == empty)
      continue;
      this.scene.pushMatrix();
      this.scene.translate(i-4,0,j-4);
      this.scene.scale(.4,.4,.4);

      //this.scene.scale(.1,.1,.1);
      this.piece.set_directions(translate_orientations(this.board[i][j][1]));
      this.piece.set_color(this.colors[this.board[i][j][0]]);
      this.piece.display();
      this.scene.popMatrix();

    }
  }
*/


game.prototype.debug_board = function(){
	
	var string = '';
	
	for(var i = 0; i < this.board.length; i++){
		string += '[';
		for(var j = 0; j < this.board[i].length; j++){
		string += '[';
		string += this.board[i][j][0];		
		string += ',';
		string += this.board[i][j][1];
		string += ']';
		}
		string += ']\n';
	}
	
	console.log(string);
	
};

var empty = 'empty';
var green = 'green';
var red = 'red';
var n = 'n';
var ne = 'ne';
var e = 'e';
var se = 'se';
var s = 's';
var sw = 'sw';
var w = 'w';
var nw = 'nw';
