getChar(Input):-
	get_char(Input),
	get_char(_).

getInt(Input):-
	getChar(Input1),
	char_code(Input1,Code),
	Input is Code - 48.

menu:-
	print_menu,
	getInt(Input),
	(
	Input = 1 -> mode;
	Input = 2 -> help;
	Input = 3 -> halt;
	true
	),
	menu
.

print_menu:-
	nl,
	write('PLOY'), nl,
	nl,
	write('1. Play'), nl,
	write('2. How to play'), nl,
	write('3. Exit'), nl,
	nl,
	write('Choose an option: ').

mode:-
	print_play,
	abolish(jogador/2),
	abolish(difficulty/1),
	getInt(Input),
	(
	Input = 1 -> vs_player;
	Input = 2 -> vs_bot;
	Input = 3 -> vs_bot_bot;
	Input = 4 -> menu;
	true
	),
	mode
.

print_play:-
	nl,
	write('PLAY'), nl,
	nl,
	write('1. Player Vs. Player'), nl,
	write('2. Player Vs. AI'), nl,
	write('3. AI vs. AI'), nl,
	write('4. Back'), nl,
	nl,
	write('Choose an option: ').

vs_player:-
	assert(jogador('red','human')),
	assert(jogador('green','human')),
	play.

vs_bot:-
	repeat,nl,
	write('Insert bot difficulty(0 - random, 1 - greedy): '),nl,
	getInt(Difficulty),
	availlableDifficulty(Difficulty),
	assert(difficulty(Difficulty)),
	!,
	assert(jogador('red','human')),
	assert(jogador('green','bot')),
	play.

vs_bot_bot:-
	repeat,nl,
	write('Insert bot difficulty(0 - random, 1 - greedy): '),nl,
	getInt(Difficulty),
	availlableDifficulty(Difficulty),
	assert(difficulty(Difficulty)),
	!,
	assert(jogador('red','bot')),
	assert(jogador('green','bot')),
	play.
availlableDifficulty(0).
availlableDifficulty(1).

help:-
	nl,nl,
	write('Ploy is an abstract strategy board game, much similar to chess.'),nl,
	write('There are 4 types of Pieces:Shields,Probes,Lances and the Commander.'),nl,
	write('Each piece has a set number of indicators, which determine which direction the piece can travel in at any given time. A piece can only travel in directions its indicators are pointing. A piece can also rotate so it\'s indicators face another direction'),nl,
	write('Shields: They only have 1 indicator and can only move 1 space at a time. Shields are the only piece that can move and rotate in the same turn.'),nl,
	write('Probes: They have 2 indicators and can move 2 spaces at a time.'),nl,
	write('Lances: They have 3 indicators and can move 3 spaces at a time.'),nl,
	write('Commander: It has 4 indicators and can move 1 space at a time.'),nl,
	write('The objective of the game is to either capture the enemy commander, or capture every other piece except the commander.'),nl,
	menu.
