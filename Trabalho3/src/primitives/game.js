function game(scene){
  this.scene = scene;
  this.stack = [];
  this.queue = [];
  var red = [0.8,0.2,0.2,1];
  var green = [0.2,0.8,0.2,1];
  this.board =
  [
    [
      null,
      {team:red,directions:[2,4,6]},
      {team:red,directions:[0,2,5]},
      {team:red,directions:[3,4,5]},
      {team:red,directions:[1,3,5,6]},
      {team:red,directions:[3,4,5]},
      {team:red,directions:[0,2,5]},
      {team:red,directions:[2,4,6]},
      null
    ],
    [
      null,
      null,
      {team:red,directions:[3,4]},
      {team:red,directions:[3,5]},
      {team:red,directions:[0,4]},
      {team:red,directions:[3,5]},
      {team:red,directions:[4,5]},
      null,
      null
    ],
    [
      null,
      null,
      null,
      {team:red,directions:[4]},
      {team:red,directions:[4]},
      {team:red,directions:[4]},
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      {team:green,directions:[0]},
      {team:green,directions:[0]},
      {team:green,directions:[0]},
      null,
      null,
      null,
    ],
    [
      null,
      null,
      {team:green,directions:[0,1]},
      {team:green,directions:[7,1]},
      {team:green,directions:[0,4]},
      {team:green,directions:[7,1]},
      {team:green,directions:[7,0]},
      null,
      null,
    ],
    [
      null,
      {team:green,directions:[6,0,2]},
      {team:green,directions:[7,1,4]},
      {team:green,directions:[7,1,0]},
      {team:green,directions:[7,1,3,5]},
      {team:green,directions:[7,1,0]},
      {team:green,directions:[7,1,4]},
      {team:green,directions:[6,0,2]},
      null,
    ]
  ];

  this.piece = new piece(scene);
  this.chessboard = new chessboard(
    scene,
    9,
    9,
    "t_chessboard",
    -1,
    -1,
    [0.3,0.3,0.3,1],
    [.7,.7,.7,1],
    [1,1,1,1]
  );

}

game.prototype.constructor = game;

game.prototype.undo = function(){
  var play = this.stack.pop();
  var reverse =
  {
    xi:play.xf,
    yi:play.yf,
    xf:play.xi,
    yf:play.yi
  };
  this.play(reverse);
  this.stack.pop();
  this.queue.shift();
  this.queue.shift();

}

game.prototype.play = function(play){
  this.stack.push(play);
  this.queue.push(play);

  var piece = this.board[play.xi][play.yi];
  this.board[play.xi][play.yi] = null;
  this.board[play.xf][play.yf] = piece;
}

game.prototype.display = function(){

  this.scene.pushMatrix();
  this.scene.scale(9,1,9);
  this.scene.rotate(-Math.PI/2,1,0,0);
  this.chessboard.display();
  this.scene.popMatrix();


  for(var i = 0; i < this.board.length; i++){
    for(var j = 0; j < this.board[i].length; j++){
      if(this.board[i][j] == null)
      continue;
      this.scene.pushMatrix();
      this.scene.translate(i-4,0,j-4);
      this.scene.scale(.4,.4,.4);

      //this.scene.scale(.1,.1,.1);
      this.piece.set_directions(this.board[i][j].directions);
      this.piece.set_color(this.board[i][j].team);
      this.piece.display();
      this.scene.popMatrix();

    }
  }

}
