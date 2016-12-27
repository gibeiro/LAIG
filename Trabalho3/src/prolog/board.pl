:- dynamic board/1.

initial_board([
[['empty',[]],['green',['w','s','e']],['green',['s','ne','nw']],['green',['sw','s','se']],['green',['sw','se','ne','nw']],['green',['sw','se','s']],['green',['s','ne','nw']],['green',['w','s','e']],['empty',[]]],
[['empty',[]],['empty',[]],['green',['s','se']],['green',['sw','se']],['green',['s','n']],['green',['sw','se']],['green',['sw','s']],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['green',['s']],['green',['s']],['green',['s']],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['empty',[]],['red',['n']],['red',['n']],['red',['n']],['empty',[]],['empty',[]],['empty',[]]],
[['empty',[]],['empty',[]],['red',['n','ne']],['red',['nw','ne']],['red',['s','n']],['red',['nw','ne']],['red',['nw','n']],['empty',[]],['empty',[]]],
[['empty',[]],['red',['w','n','e']],['red',['n','se','sw']],['red',['nw','n','ne']],['red',['sw','se','ne','nw']],['red',['nw','ne','n']],['red',['n','se','sw']],['red',['w','n','e']],['empty',[]]]]).
vazio(['empty',[]]).

draw_gameboard:-X^(board(X),draw_board(X)).

draw_board(Tab):-
  nl,
  write(' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |'),nl,
	draw_straightLine,nl,
	draw_lines(Tab,0).

draw_lines([],_).
draw_lines([LIN|REST],LineNumber):-(
	write(' |'),draw_line1(LIN),nl,
  write(LineNumber),
	write('|'),draw_line2(LIN),nl,
	write(' |'),draw_line3(LIN),nl,
	draw_straightLine,
	nl,
  LineNumber2 is LineNumber+1,
	draw_lines(REST,LineNumber2)).

draw_line1([]).
draw_line1([SQUARE|REST]):-
	draw_line1sq1(SQUARE),
	draw_line1sq2(SQUARE),
	draw_line1sq3(SQUARE),
	write('|'),
	draw_line1(REST).

draw_line1sq1([]).
draw_line1sq1([_|[SIDES|_]]):-
	draw_orientation_symbol('nw',SIDES).

draw_line1sq2([]).
draw_line1sq2([_|[SIDES|_]]):-
	draw_orientation_symbol('n',SIDES).

draw_line1sq3([]).
draw_line1sq3([_|[SIDES|_]]):-
	draw_orientation_symbol('ne',SIDES).

draw_line2([]).
draw_line2([SQUARE|REST]):-
	draw_line2sq1(SQUARE),
	draw_line2sq2(SQUARE),
	draw_line2sq3(SQUARE),
	write('|'),
	draw_line2(REST).

draw_line2sq1([]).
draw_line2sq1([_|[SIDES|_]]):-
	draw_orientation_symbol('w',SIDES).

draw_line2sq2([]).
draw_line2sq2([TEAM|[_|_]]):-
	draw_team_symbol(TEAM).

draw_line2sq3([]).
draw_line2sq3([_|[SIDES|_]]):-
	draw_orientation_symbol('e',SIDES).

draw_line3([]).
draw_line3([SQUARE|REST]):-
	draw_line3sq1(SQUARE),
	draw_line3sq2(SQUARE),
	draw_line3sq3(SQUARE),
	write('|'),
	draw_line3(REST).

draw_line3sq1([]).
draw_line3sq1([_|[SIDES|_]]):-
	draw_orientation_symbol('sw',SIDES).

draw_line3sq2([]).
draw_line3sq2([_|[SIDES|_]]):-
	draw_orientation_symbol('s',SIDES).

draw_line3sq3([]).
draw_line3sq3([_|[SIDES|_]]):-
	draw_orientation_symbol('se',SIDES).

draw_straightLine:-write('--------------------------------------').

orientationSymbol('n','|').
orientationSymbol('s','|').
orientationSymbol('w','-').
orientationSymbol('e','-').
orientationSymbol('nw','\\').
orientationSymbol('ne','/').
orientationSymbol('sw','/').
orientationSymbol('se','\\').
teamSymbol('red','R').
teamSymbol('green','G').

draw_orientation_symbol(Ori,Sides):-
  \+ member(Ori,Sides),
  write(' ').

draw_orientation_symbol(Ori,Sides):-
  member(Ori,Sides),
  orientationSymbol(Ori,Symbol),
  write(Symbol).

draw_team_symbol(Team):-
  Team = 'green',
  write('G').

draw_team_symbol(Team):-
  Team = 'red',
  write('R').

draw_team_symbol(Team):-
  Team \= 'red' , Team \= 'green',
  write(' ').
