/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { calcWidth, getFullURL } from "../utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameState } from "../store/boardState";
import MoveSideBar from "../sidebar/MoveSideBar";
import { axiosInstance, ENDPOINTS, pusher } from "../constants";
import { userState } from "../store/userState";
import { Button } from "@mui/material";
import UserSearchBoard from "../unit/UserSearchBoard";

declare global {
	interface Window {
		STOCKFISH: any;
	}
}

const game = new Chess();

type Props = {
	children?: (props: { position: string; onDrop: (arg: { sourceSquare: string; targetSquare: string }) => Promise<void> | void }) => React.ReactNode;
};

const PassNPlayBoard: React.FC<Props> = () => {
	const [fen, setFen] = useState("start");
	const [gameSt, setGameState] = useRecoilState(gameState);
	const user = useRecoilValue(userState);
	const channel = pusher.subscribe('private-move');
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (user?.activeGame) {
			try {
				gameSt.pgn !== '' ? game.loadPgn(gameSt.pgn!) : game.load(gameSt.fen !== '' ? gameSt.fen! : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
				setFen(gameSt.fen !== '' ? gameSt.fen! : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
				setGameStarted(true);
			} catch (error) {
				console.log('error here');
			}
		}
	}, [user]);

	const onDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string }) => {
		try {
			if (gameOver || !gameStarted || game.turn().toString() !== gameSt.sideToMove[0]) {
				return;
			}
			game.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});
		} catch (error) {
			return;
		}

		setFen(game.fen());
		setGameState((cur) => ({
			...cur,
			moves: game.history()
		}));

		channel.trigger('client-new-move', {
			pgn: game.pgn({
				newline: '\n'
			}),
			fen: game.fen(),
			gameId: user?.activeGame!.id,
		});
		return new Promise<void>((resolve) => {
			resolve();
		});
	}, []);

	useEffect(() => {
		channel.bind('client-new-move', (data: any) => {
			game.loadPgn(data.pgn, { newlineChar: '\n' });
			setFen(data.fen);
			setGameState((cur) => ({
				...cur,
				moves: game.history(),
			}));
		});

		channel.bind('game-resign', () => {
			setGameOver(true);
		})
		if (user?.activeGame) {
			setGameStarted(true);
		}
		return () => {
			channel.unbind_all();
		}
	}, []);

	useEffect(() => {
		if (game.isGameOver()) {
			setGameOver(true);
		}
	}, [gameSt])

	const handleResignClicked = async () => {
		await axiosInstance.post(getFullURL(ENDPOINTS.resignGame), {
			gameId: gameSt.id
		}, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
	}


	return <>
		<div className="lg:grid lg:grid-cols-2 lg:grid-rows-1 h-full gap-4">
			<div className="flex flex-col items-center justify-center mr-4 w-full gap-4">
				<div className="border-4 rounded-md border-red-900 w-fit relative">
					<Chessboard
						position={fen}
						calcWidth={calcWidth}
						onDrop={onDrop}
						orientation={gameSt.sideToMove as ('white' | 'black')}
						boardStyle={{
							borderRadius: "5px",
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
						}}
					/>
					{
						gameOver && <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-primary text-white font-bold p-2 px-4 rounded-full z-20">Game Over</span>
					}
				</div>
				<div>
					<Button variant="contained" onClick={handleResignClicked}>Resign</Button>
				</div>
			</div>
			{
				user?.activeGame ? <MoveSideBar side={game.turn().toString()} /> : <UserSearchBoard />
			}
		</div>

	</>;
};

export default PassNPlayBoard;
