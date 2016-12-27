:- use_module(library(system)).
:- use_module(library(between)).
:- use_module(library(random)).
:- include('board.pl').
:- include('menu.pl').

ploy:- menu.

%play
play:-
(
	board(B),
	playCycle(0,'red',B)
).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%ciclo do jogo
playCycle(N,Team,Board):-
	player_plays(N,Board,Team,NewBoard),
	(Team = 'green' -> NextN is N+1 ; NextN is N),
	(assertGameEnded(NewBoard,WinnerTeam) -> endGame(WinnerTeam,NewBoard); (switchTeam(Team,NextTeam),playCycle(NextN,NextTeam,NewBoard),!))
.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%switchTeam(+Team,-NextTeam)
switchTeam(Team,NextTeam):-
  Team = 'green' , NextTeam = 'red',!.


switchTeam(Team,NextTeam):-
	Team = 'red',NextTeam = 'green',!.

%assertTeam(+Piece,+Team).
assertTeam([Team|_],Team).


%endGame(+WinnerTeam,+Board)
endGame(WinnerTeam,Board):-
	nl,nl,write('        '),write(WinnerTeam), write(' won the game!'),nl,draw_board(Board),!.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%player_plays(+N,+Board,+Team,-NewBoard)
player_plays(N,Board,Team,NewBoard):-
	jogador(Team,HumanOrBot),
	HumanOrBot = 'human',
	human_plays(N,Board,Team,NewBoard),!.

player_plays(N,Board,Team,NewBoard):-
	jogador(Team,HumanOrBot),
	HumanOrBot = 'bot',
	bot_plays(N,Board,Team,NewBoard),!.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%human_plays(+N,+Board,+Team,-NewBoard)
human_plays(N,Board,Team,NewBoard):-
	repeat,
	nl,nl,
	write('             '),write(Team),write(' team turn '),write(N),nl,
	draw_board(Board),
	getXY(X,Y),
	getPiece(X,Y,Board,Piece),
	assertTeam(Piece,Team),
	chooseOptions(Piece,Move,Rotate),
	(
	(Rotate = 1 , Move = 0) -> chooseRotate(Board, X, Y, NewBoard);
	(Rotate = 0 , Move = 1) -> chooseMove(Board, X, Y, NewBoard,_,_);
	(Rotate = 1 , Move = 1) -> (chooseMove(Board, X, Y, IntBoard,Xf,Yf),chooseRotate(IntBoard, Xf, Yf, NewBoard));
	true
	),
	!
.

getXY(X,Y):-
	write('X - '),
	getInt(Input),
	X = Input,
	write('Y - '),
	getInt(Input2),
	Y = Input2
.

chooseOptions([_|[Orientations|_]],Move,Rotate):-
	length(Orientations,Length),
	(Length = 1 -> write('Move(1) Rotate(2) Both(3): '); write('Move(1) Rotate(2): ')),
	getInt(Input),
	(
	Input = 1 -> (Move = 1,Rotate = 0);
	Input = 2 -> (Move = 0,Rotate = 1);
	(Input = 3, Length = 1) -> (Move = 1,Rotate = 1);
	false
	),!
.

chooseRotate(Board, X, Y, NewBoard):-
	getPiece(X,Y,Board,Piece),
	write('(1)Clockwise (2)CounterClockwise: '),
	getInt(Input),
	Angle is Input-1,
	rotatePiece(Piece,Angle,NewPiece),setPiece(X,Y,Board,NewBoard,NewPiece),
	!
.

chooseMove(Board, X, Y, NewBoard,Xf,Yf):-
	getPiece(X,Y,Board,_),
	write('Orientation(n,s,w,e,nw,ne,sw,se): '),
	getChar(InputOri),
	write('Length(1-3): '),
	getInt(InputLen),
	Length = InputLen,
	movePiece(X,Y,InputOri,Length,Board,NewBoard,_),
	calcEndPoint(X,Y,InputOri,Length,Xf,Yf),
	!
.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%bot_plays(+N,+Board,+Team,-NewBoard)
bot_plays(N,Board,Team,NewBoard):-
	nl,nl,
	write('         '),write(Team),write(' team turn '),write(N),write(' (bot)'),nl,
	draw_board(Board),
	difficulty(Dif),
	bot_plays_diff(Dif,Board,Team,NewBoard),!
.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%modo aleatorio
bot_plays_diff(Dif,Board,Team,NewBoard,X,Y,Length,Orientation):-
	Dif = 0,
	repeat,
	getRandomXY(X,Y),
	getPiece(X,Y,Board,Piece),
	assertTeam(Piece,Team),
	% MoveOrRotate = 0 -> roda, 1-3 -> move
	random(0,4,MoveOrRotate),
	moveOrRotate(MoveOrRotate,Board,X,Y,Piece,NewBoard,Orientation,Length),
	!
.
%getRandomXY(-X,-Y)
getRandomXY(X,Y):-
	random(0,9,X),
	random(0,9,Y)
.
%getRandomOriAndLength(+Piece,-Orientation,-Length)
getRandomOriAndLength([_|[Orientations|_]],Orientation,Length):-
	random_member(Orientation,Orientations),
	length(Orientations,L),
	L1 is L+1,
	random(1,L1,Length)
.
%move
moveOrRotate(MoveOrRotate,Board,X,Y,Piece,NewBoard,Orientation,Length):-
	between(1,3,MoveOrRotate),
	getRandomOriAndLength(Piece,Orientation,Length),
	movePiece(X,Y,Orientation,Length,Board,NewBoard,_),!
.
%rotate
moveOrRotate(MoveOrRotate,Board,X,Y,Piece,NewBoard,Orientation,Length):-
	MoveOrRotate = 0,
	Length = 0,
	%% É feito um movimento para um tabuleiro nao usado para que a probabilidade de rotate falhar seja igual à de move falhar
	getRandomOriAndLength(Piece,Orientation,Length),
	movePiece(X,Y,Orientation,Length,Board,_,_),
	random(0,2,Angle),
	rotatePiece(Piece,Angle,NewPiece),
	setPiece(X,Y,Board,NewBoard,NewPiece),
	Orientation = Angle,!
.



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% modo ganancioso
bot_plays_diff(Dif,Board,Team,NewBoard,X,Y,Length,Orientation):-
	Dif = 1,
	findGreedyPlay(Board,Team,X,Y,Orientation,Length,Consumed),!,
	moveOrRandom(Board,Team,X,Y,Orientation,Length,Consumed,NewBoard),!
.

moveOrRandom(Board,Team,X,Y,Orientation,Length,Consumed,NewBoard):-
	% Se nao for encontrada nenhuma jogada que resulte em capturar uma peça inimiga, e realizada uma jogada aleatoria
	(Consumed = 0 ; Consumed = -1),
	bot_plays_diff(0,Board,Team,NewBoard,X,Y,Length,Orientation).

moveOrRandom(Board,_,X,Y,Orientation,Length,Consumed,NewBoard):-
	Consumed > 0,
	movePiece(X,Y,Orientation,Length,Board,NewBoard,_).


%findGreedyPlay(+Board,+Team,-X,-Y,-Orientation,-Length,-Consumed)
findGreedyPlay(Board,Team,X,Y,Orientation,Length,Consumed):-
	findGreedyPlay_Y(0,Board,Team,X,Y,Orientation,Length,Consumed).

%% Iterate though Ys

findGreedyPlay_Y(CurrY,_,_,_,_,_,_,Consumed):-
	CurrY = 9,
	Consumed = -1.

findGreedyPlay_Y(CurrY,Board,Team,X,Y,Orientation,Length,Consumed):-
	CurrY \= 9,
	findGreedyPlay_X(0,CurrY,Board,Team,X1,Y1,Ori1,Len1,Cons1),
	CurrY1 is CurrY + 1,
	findGreedyPlay_Y(CurrY1,Board,Team,X2,Y2,Ori2,Len2,Cons2),
	assertHighest(X1,Y1,Ori1,Len1,Cons1,X2,Y2,Ori2,Len2,Cons2,X,Y,Orientation,Length,Consumed),!
.

%% Iterate though Xs

findGreedyPlay_X(CurrX,_,_,_,_,_,_,_,Consumed):-
	CurrX = 9,
	Consumed = -1.

findGreedyPlay_X(CurrX,CurrY,Board,Team,X,Y,Orientation,Length,Consumed):-
	CurrX \= 9,
	(
	(getPiece(CurrX,CurrY,Board,[Team1|[Ori|_]]),Team = Team1)->
	(
	length(Ori,MaxLength),
	findGreedyPlay_Ori(CurrX,CurrY,Ori,MaxLength,Board,Team,X1,Y1,Ori1,Len1,Cons1)
	);
	Cons1 = -1
	),
	CurrX1 is CurrX+1,
	findGreedyPlay_X(CurrX1,CurrY,Board,Team,X2,Y2,Ori2,Len2,Cons2),
	assertHighest(X1,Y1,Ori1,Len1,Cons1,X2,Y2,Ori2,Len2,Cons2,X,Y,Orientation,Length,Consumed),!
.

%% Iterate though Orientations

findGreedyPlay_Ori(_,_,[],_,_,_,_,_,_,_,Consumed):-
	Consumed = -1.

findGreedyPlay_Ori(CurrX,CurrY,[CurrOri|Rest],MaxLength,Board,Team,X,Y,Orientation,Length,Consumed):-
	findGreedyPlay_Len(CurrX,CurrY,CurrOri,1,MaxLength,Board,Team,X1,Y1,Ori1,Len1,Cons1),
	findGreedyPlay_Ori(CurrX,CurrY,Rest,MaxLength,Board,Team,X2,Y2,Ori2,Len2,Cons2),
	assertHighest(X1,Y1,Ori1,Len1,Cons1,X2,Y2,Ori2,Len2,Cons2,X,Y,Orientation,Length,Consumed),!
.

%% Iterate though Lenghts

findGreedyPlay_Len(_,_,_,CurrLength,MaxLength,_,_,_,_,_,_,Consumed):-
	CurrLength > MaxLength,
	Consumed = -1.

findGreedyPlay_Len(CurrX,CurrY,CurrOri,CurrLength,MaxLength,Board,Team,X,Y,Orientation,Length,Consumed):-
	CurrLength =< MaxLength,
	nDirections(CurrLength,Len),
	(movePiece(CurrX,CurrY,CurrOri,Len,Board,_,Cons1)->true;Cons1 = -1),
	CurrLength1 is CurrLength + 1,
	findGreedyPlay_Len(CurrX,CurrY,CurrOri,CurrLength1,MaxLength,Board,Team,X2,Y2,Ori2,Len2,Cons2),
	assertHighest(CurrX,CurrY,CurrOri,Len,Cons1,X2,Y2,Ori2,Len2,Cons2,X,Y,Orientation,Length,Consumed),!
.

%% Assert play with higher Consumed value

assertHighest(X1,Y1,Ori1,Len1,Cons1,_,_,_,_,Cons2,X,Y,Ori,Len,Cons):-
	Cons1 >= Cons2,
	X = X1,
	Y = Y1,
	Ori = Ori1,
	Len = Len1,
	Cons = Cons1
.

assertHighest(_,_,_,_,Cons1,X2,Y2,Ori2,Len2,Cons2,X,Y,Ori,Len,Cons):-
	Cons1 < Cons2,
	X = X2,
	Y = Y2,
	Ori = Ori2,
	Len = Len2,
	Cons = Cons2
.



%%%%%%%%%%% ROTAÇAO DE PEÇA %%%%%%%%%%%%%%%

% Exemplo de Piece: ['red',['s']] %

rotatePiece(Piece,Orientation,PieceNova):-
	between(0,1,Orientation),
	rotatePiece_aux(Piece,Orientation,PieceNova),!.

rotatePiece_aux([Team|[Sides|_]],Orientation,[Team|[NewSides|_]]):-
	rotatePiece_aux2(Orientation,Sides,NewSides),!.

rotatePiece_aux2(_,[],[]).
rotatePiece_aux2(Orientation,[Side|Rest1],[NewSide|Rest2]):-
	clockwise(Orientation),
	rotateC(Side,NewSide),rotatePiece_aux2(Orientation,Rest1,Rest2),!.

rotatePiece_aux2(Orientation,[Side|Rest1],[NewSide|Rest2]):-
	counterClockwise(Orientation),
	rotateCC(Side,NewSide),rotatePiece_aux2(Orientation,Rest1,Rest2),!.

%Rotate Clockwise
clockwise(0).
rotateC('n','ne').
rotateC('ne','e').
rotateC('e','se').
rotateC('se','s').
rotateC('s','sw').
rotateC('sw','w').
rotateC('w','nw').
rotateC('nw','n').
%Rotate CounterClockwise
counterClockwise(1).
rotateCC('n','nw').
rotateCC('ne','n').
rotateCC('e','ne').
rotateCC('se','e').
rotateCC('s','se').
rotateCC('sw','s').
rotateCC('w','sw').
rotateCC('nw','w').

%%%%%%%%%%%%% MANIPULACAO DE PEÇAS %%%%%%%%%%%%%%%

%getPiece(+X,+Y,+Board,-Piece)
getPiece(X,Y,Board,Piece):-
	between(-1,9,X),
	between(-1,9,Y),
	getPiece_aux(0,X,Y,Board,Piece),!.

getPiece_aux(_,_,_,[],_).
getPiece_aux(Y,X,Y,[CurrLine|_],Piece):-
	getPiece_aux2(0,X,Y,CurrLine,Piece),!.

getPiece_aux(N,X,Y,[_|Rest],Piece):-
	N \= Y,
	Y1 is N + 1,
	getPiece_aux(Y1,X,Y,Rest,Piece),!.

getPiece_aux2(_,_,_,[],_).
getPiece_aux2(X,X,_,[CurrPiece|_],Piece):-
	Piece = CurrPiece,!.

getPiece_aux2(N,X,Y,[_|Rest],Piece):-
	N \= X,
	X1 is N + 1,
	getPiece_aux2(X1,X,Y,Rest,Piece),!.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%setPiece(+X,+Y,+Board,-NewBoard,+Piece)
setPiece(X,Y,Board,NewBoard,Piece):-
setPiece_aux(X,Y,Board,NewBoard,Piece),!.

setPiece_aux(_,_,[],[],_).
setPiece_aux(X,Y,[CurrLine|Rest],[CurrLine2|Rest2],Piece):-
	setPiece_aux2(X,Y,CurrLine,CurrLine2,Piece),
	Y1 is Y-1,
	setPiece_aux(X,Y1,Rest,Rest2,Piece),!.

setPiece_aux2(_,_,[],[],_).
setPiece_aux2(X,Y,[_|Rest],[CurrPiece2|Rest2],Piece):-
	X = 0, Y = 0,
	CurrPiece2 = Piece,
	X1 is X-1,
	setPiece_aux2(X1,Y,Rest,Rest2,Piece),!.

setPiece_aux2(X,Y,[CurrPiece|Rest],[CurrPiece2|Rest2],Piece):-
	(X \= 0; Y \= 0),
	CurrPiece2 = CurrPiece,
	X1 is X-1,
	setPiece_aux2(X1,Y,Rest,Rest2,Piece),!.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%movePiece(+X,+Y,+Orientation,+Length,+Board,-NewBoard,-Consumed) consumed= length da peça que foi consumida(0 empty, 1 shield, etc)
movePiece(X,Y,Orientation,Length,Board,NewBoard,Consumed):-
getPiece(X,Y,Board,Piece),
calcEndPoint(X,Y,Orientation,Length,Xf,Yf),
assertCanMove(Piece,X,Y,Xf,Yf,Orientation,Length,Board),
getPiece(Xf,Yf,Board,[_|[ConsOri|_]]),
length(ConsOri,Consumed),
setPiece(Xf,Yf,Board,IntBoard,Piece),
vazio(Vazio),
setPiece(X,Y,IntBoard,NewBoard,Vazio),!
.


assertCanMove(Piece,X,Y,Xf,Yf,Orientation,Length,Board):-
assertHasOrientation(Orientation,Piece),
assertValidLength(Length,Piece),
assertInsideBoundaries(Xf,Yf),
assertNoCollision(X,Y,Orientation,Length,Board),!.

assertHasOrientation(Orientation,Piece):-
assertHasOrientation_aux(Orientation,Piece),!.

assertHasOrientation_aux(Orientation,[_|[Orientations|_]]):-
member(Orientation,Orientations),!.

assertValidLength(Length,Piece):-
assertValidLength_aux(Length,Piece),!.

assertValidLength_aux(Length,[_|[Orientations|_]]):-
length(Orientations,NDirections),
nDirections(NDirections,MaxLength),
Length =< MaxLength,!.

nDirections(1,1).
nDirections(2,2).
nDirections(3,3).
nDirections(4,1).
%Coord multipliers
multiplierX('s',0).
multiplierX('n',0).
multiplierX('e',1).
multiplierX('w',-1).
multiplierX('ne',1).
multiplierX('se',1).
multiplierX('nw',-1).
multiplierX('sw',-1).

multiplierY('s',1).
multiplierY('n',-1).
multiplierY('e',0).
multiplierY('w',0).
multiplierY('ne',-1).
multiplierY('se',1).
multiplierY('nw',-1).
multiplierY('sw',1).


assertInsideBoundaries(Xf,Yf):-
Xf < 9,
Xf > -1,
Yf < 9,
Yf > -1,!.

%calcEndPoint(+X,+Y,+Orientation,+Length,-Xf,-Yf)
calcEndPoint(X,Y,Orientation,Length,Xf,Yf):-
multiplierX(Orientation,MultX),
multiplierY(Orientation,MultY),
Xf is X + Length*MultX,
Yf is Y + Length*MultY,!.

assertNoCollision(X,Y,Orientation,Length,Board):-
calcEndPoint(X,Y,Orientation,Length,Xf,Yf),
getPiece(X,Y,Board,Piece1),
getPiece(Xf,Yf,Board,Piece2),
assertDifferentTeam(Piece1,Piece2),
Length1 is Length - 1,
assertNoCollision_inter(X,Y,Orientation,Length1,Board),!.


assertNoCollision_inter(X,Y,Orientation,Length,Board):-
	Length > 0,
	calcEndPoint(X,Y,Orientation,Length,Xf,Yf),
	getPiece(Xf,Yf,Board,Piece),
	assertEmpty(Piece),
	Length1 is Length - 1,
	assertNoCollision_inter(X,Y,Orientation,Length1,Board),!.

assertNoCollision_inter(_,_,_,Length,_):-
	Length =< 0,
	true,!.

assertEmpty([Team|_]):-
Team == 'empty'.

assertDifferentTeam([Team1|_],[Team2|_]):-
Team1 \= Team2.

%%%%%%%%%%%%% VERIFICA SE JOGO ACABOU %%%%%%%%%%%%%%%

%assertGameEnded(+Board,-Winner)
assertGameEnded(Board,Winner):-
(assertCommanderDead(Board,'red')-> Winner = 'green';
assertCommanderDead(Board,'green')-> Winner = 'red';
assertAllSmallDead(Board,'red')-> Winner = 'green';
assertAllSmallDead(Board,'green')-> Winner = 'red';
false),!.

assertCommanderDead(Board,Team):-
assertCommanderDead_aux(Board,Team,0),!.

assertCommanderDead_aux(_,_,Y):-
	Y = 9,
	true,!.
assertCommanderDead_aux(Board,Team,Y):-
	Y < 9,
	assertCommanderDead_aux2(Board,Team,0,Y),
	Y1 is Y + 1,
	assertCommanderDead_aux(Board,Team,Y1),!.

assertCommanderDead_aux2(_,_,X,_):-
	X = 9,
	true,!.
assertCommanderDead_aux2(Board,Team,X,Y):-
	X < 9,
	getPiece(X,Y,Board,[TeamO|[Orientations|_]]),
	length(Orientations,Length),
	assertNotCommander(Team,TeamO,Length),
	X1 is X+1,
	assertCommanderDead_aux2(Board,Team,X1,Y),!.

assertNotCommander(Team,TeamO,_):-
	Team \= TeamO,
	true,!.

assertNotCommander(Team,TeamO,Length):-
	Team = TeamO,
	Length \= 4,!.

assertAllSmallDead(Board,Team):-
	assertAllSmallDead_aux(Board,Team,0),!.

assertAllSmallDead_aux(_,_,Y):-
	Y = 9,
	true,!.

assertAllSmallDead_aux(Board,Team,Y):-
	Y < 9,
	assertAllSmallDead_aux2(Board,Team,0,Y),
	Y1 is Y+1,
	assertAllSmallDead_aux(Board,Team,Y1),!.

assertAllSmallDead_aux2(_,_,X,_):-
	X = 9,
	true,!.

assertAllSmallDead_aux2(Board,Team,X,Y):-
	X < 9,
	getPiece(X,Y,Board,[TeamO|[Orientations|_]]),
	length(Orientations,Length),
	assertIsCommander(Team,TeamO,Length),
	X1 is X+1,
	assertAllSmallDead_aux2(Board,Team,X1,Y),!.

assertIsCommander(Team,TeamO,_):-
	Team \= TeamO,
	true,!.

assertIsCommander(Team,TeamO,Length):-
	Team = TeamO,
	Length = 4,!.
