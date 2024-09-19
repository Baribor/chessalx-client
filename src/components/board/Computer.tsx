/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { calcWidth } from "../utils";
import { useSetRecoilState } from "recoil";
import { gameState } from "../store/boardState";
import MoveSideBar from "../sidebar/MoveSideBar";
import { Button } from "@mui/material";

declare global {
	interface Window {
		STOCKFISH: any;
	}
}

const STOCKFISH = window.STOCKFISH;
const game = new Chess();

type Props = {
	children?: (props: { position: string; onDrop: (arg: { sourceSquare: string; targetSquare: string }) => Promise<void> | void }) => React.ReactNode;
};

const ComputerBoard: React.FC<Props> = () => {
	const [fen, setFen] = useState("start");
	const setGameState = useSetRecoilState(gameState);
	const [gameOver, setGameOver] = useState(false);
	const [playerSide, setPlayerSide] = useState("white")


	useEffect(() => {
		const randomBinary = Math.floor(Math.random() * 2);
		const sides = ['white', 'black'];
		setPlayerSide(sides[randomBinary])
		setGameState({
			isGameOver: false,
			moves: [],
			sideToMove: sides[randomBinary],
			whitePlayer: {
				username: 'Computer',
				id: '1'
			},
			blackPlayer: {
				username: 'Human',
				id: '2'
			},
		});
		setFen(game.fen());
		engineGame().prepareMove();
	}, []);

	const onDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string }) => {
		try {
			game.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});
		} catch (error) {
			return;
		}

		return new Promise<void>((resolve) => {
			setFen(game.fen());
			setGameState((cur) => ({
				...cur!,
				moves: game.history(),
			}))
			resolve();
		}).then(() => engineGame().prepareMove());
	}, []);

	const engineGame = useCallback((options?: { stockfishjs?: string }) => {
		options = options || {};

		const engine =
			typeof STOCKFISH === "function"
				? STOCKFISH()
				: new Worker(options.stockfishjs || "./stockfish.js");
		const evaler =
			typeof STOCKFISH === "function"
				? STOCKFISH()
				: new Worker(options.stockfishjs || "./stockfish.js");
		const engineStatus: any = {};
		const time: any = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
		const playerColor = playerSide;
		let clockTimeoutID: ReturnType<typeof setTimeout> | null = null;
		let announced_game_over = false;

		setInterval(() => {
			if (announced_game_over) {
				return;
			}

			if (game.isGameOver()) {
				announced_game_over = true;
			}
		}, 500);

		const uciCmd = (cmd: string, which?: Worker) => {
			(which || engine).postMessage(cmd);
		};

		uciCmd("uci");

		const clockTick = () => {
			const t =
				(time.clockColor === "white" ? time.wtime : time.btime) +
				time.startTime -
				Date.now();
			const timeToNextSecond = (t % 1000) + 1;
			clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
		};

		const stopClock = () => {
			if (clockTimeoutID !== null) {
				clearTimeout(clockTimeoutID);
				clockTimeoutID = null;
			}
			if (time.startTime > 0) {
				const elapsed = Date.now() - time.startTime;
				time.startTime = null;
				if (time.clockColor === "white") {
					time.wtime = Math.max(0, time.wtime - elapsed);
				} else {
					time.btime = Math.max(0, time.btime - elapsed);
				}
			}
		};

		const startClock = () => {
			if (game.turn() === "w") {
				time.wtime += time.winc;
				time.clockColor = "white";
			} else {
				time.btime += time.binc;
				time.clockColor = "black";
			}
			time.startTime = Date.now();
			clockTick();
		};

		const get_moves = () => {
			let moves = "";
			const history = game.history({ verbose: true });

			for (const move of history) {
				moves +=
					" " + move.from + move.to + (move.promotion ? move.promotion : "");
			}

			return moves;
		};

		const prepareMove = () => {
			stopClock();
			const turn = game.turn() === "w" ? "white" : "black";
			if (!game.isGameOver()) {
				if (turn !== playerColor) {
					uciCmd("position startpos moves" + get_moves());
					uciCmd("position startpos moves" + get_moves(), evaler);
					uciCmd("eval", evaler);

					if (time && time.wtime) {
						uciCmd(
							"go " +
							(time.depth ? "depth " + time.depth : "") +
							" wtime " +
							time.wtime +
							" winc " +
							time.winc +
							" btime " +
							time.btime +
							" binc " +
							time.binc
						);
					} else {
						uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
					}
				}
				if (game.history().length >= 2 && !time.depth && !time.nodes) {
					startClock();
				}
			}
		};

		evaler.onmessage = (event: any) => {
			const line = event.data || event;
			if (
				line === "uciok" ||
				line === "readyok" ||
				line.startsWith("option name")
			) {
				return;
			}
		};

		engine.onmessage = (event: any) => {
			const line = event.data || event;
			if (line === "uciok") {
				engineStatus.engineLoaded = true;
			} else if (line === "readyok") {
				engineStatus.engineReady = true;
			} else {
				let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
				if (match) {
					game.move({ from: match[1], to: match[2], promotion: match[3] });
					setFen(game.fen());
					setGameState((cur) => ({
						...cur,
						moves: game.history()
					}))
					prepareMove();
					uciCmd("eval", evaler);
				} else if ((match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))) {
					engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
				}
				if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
					const score = parseInt(match[2], 10) * (game.turn() === "w" ? 1 : -1);
					if (match[1] === "cp") {
						engineStatus.score = (score / 100.0).toFixed(2);
					} else if (match[1] === "mate") {
						engineStatus.score = "Mate in " + Math.abs(score);
					}
					if ((match = line.match(/\b(upper|lower)bound\b/))) {
						engineStatus.score =
							((match[1] === "upper") === (game.turn() === "w") ? "<= " : ">= ") + engineStatus.score;
					}
				}
			}
		};

		return {
			start() {
				uciCmd("ucinewgame");
				uciCmd("isready");
				engineStatus.engineReady = false;
				engineStatus.search = null;
				prepareMove();
				announced_game_over = false;
			},
			prepareMove() {
				prepareMove();
			},
		};
	}, []);

	const handleResignClicked = () => {
		setGameOver(true);
	}

	return <>
		<div className="lg:grid lg:grid-cols-2 lg:grid-rows-1 h-full gap-4">
			<div className="flex items-center justify-center mr-4 w-full relative flex-col gap-4">
				<div className="border-4 rounded-md border-red-900 w-fit">
					<Chessboard
						position={fen}
						calcWidth={calcWidth}
						onDrop={onDrop}
						orientation={playerSide as ('white' | 'black')}
						boardStyle={{
							borderRadius: "5px",
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
						}}
					/>
					{
						(gameOver || game.isGameOver()) && <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-primary text-white font-bold p-2 px-4 rounded-full z-20">Game Over</span>
					}
				</div>
				<div>
					<Button variant="contained" onClick={handleResignClicked}>Resign</Button>
				</div>
			</div>
			<MoveSideBar side={game.turn().toString()} />
		</div>

	</>;
};

export default ComputerBoard;
