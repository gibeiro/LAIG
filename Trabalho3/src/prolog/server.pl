:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).
:-use_module(library(unix)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		retractall(stream(_)),
		assert(stream(Stream)),
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- include('ploy.pl').

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

%start
parse_input(start, Res) :- 
initial_board(Board),
set_board(Board),!,
tell('.pipe'),
format('var board = ~w;~n', [Board]),
told,
see('.pipe'),
read_line(Codes),
name(Res,Codes),
flush_output,
seen.

%get_board
parse_input(get_board, Res) :-
board(Board),
format(Res,'var board = ~s;',[Board]).

%set_board
parse_input(set_board(Board), Res) :-
set_board(Board).

set_board(Board):-
retractall(board(_)),
assert(board(Board)).
parse_input(set_board(Board), Res) :-
set_board(Board).

%human play
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
human_play(X,Y,Orientation,Length,Team,Res):-
board(Board),
Xi is Y,
Yi is X,
getPiece(Xi,Yi,Board,Piece),
assertTeam(Piece,Team),
(
(Length = 0) -> (rotatePiece(Piece,Orientation,PieceNova),setPiece(Xi,Yi,Board,New,PieceNova));
(Length \= 0) -> (movePiece(Xi,Yi,Orientation,Length,Board,New,_))
),!,
set_board(New).

parse_input(human_play(X,Y,Orientation,Length,Team), Res) :- 
human_play(X,Y,Orientation,Length,Team,Res),
orientation(Orientation,N),
play_response([X,Y,Length,N],Res),
draw_gameboard.


play_response(L,Res):-
tell('.pipe'),
format('var play = { x:~w, y:~w, displacement:~w, orientation:~w };~n', L),
told,
see('.pipe'),
read_line(Codes),
name(Res,Codes),
flush_output,
seen.

%parse_input(human_play(_,_,_,_,_), 'var play = null').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

orientation(n,0).
orientation(ne,1).
orientation(e,2).
orientation(se,3).
orientation(s,4).
orientation(sw,5).
orientation(w,6).
orientation(nw,7).
orientation(X,X).

%bot play
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
parse_input(bot_play(Team), Res) :- 
board(Board),
bot_plays_diff(1,Board,Team,NewBoard,X,Y,Length,Orientation),!,
orientation(Orientation,N),
set_board(NewBoard),
Xi = Y, Yi =X,
tell('.pipe'),
format('var play = { x:~w, y:~w, displacement:~w, orientation:~w };~n', [Xi,Yi,Length,N]),
told,
see('.pipe'),
read_line(Codes),
name(Res,Codes),
flush_output,
seen.

%game_is_over
parse_input(is_game_over,Res):-
board(Board),
assertGameEnded(Board,Winner)
-> Res = Winner; Res = false.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
	