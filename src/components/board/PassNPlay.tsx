/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { calcWidth } from "../utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { gameState } from "../store/boardState";
import MoveSideBar from "../sidebar/MoveSideBar";
import { pusher } from "../constants";
import { userState } from "../store/userState";

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

	useEffect(() => {
		gameSt.pgn ? game.loadPgn(gameSt.pgn) : game.load(gameSt.fen!);
		setFen(gameSt.fen ?? '');
	}, []);

	const onDrop = useCallback(({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string }) => {
		try {
			if (game.turn().toString() !== gameSt.sideToMove[0]) {
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
		return () => {
			channel.unbind_all();
		}
	}, [])


	return <>
		<div className="lg:grid lg:grid-cols-2 lg:grid-rows-1 h-full gap-4">
			<div className="flex items-center justify-center mr-4 w-full">
				<div className="border-4 rounded-md border-red-900 w-fit">
					<Chessboard
						position={fen}
						calcWidth={calcWidth}
						onDrop={onDrop}
						orientation={gameSt.sideToMove}
						boardStyle={{
							borderRadius: "5px",
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
						}}
					/>
				</div>
			</div>
			<MoveSideBar />
		</div>

	</>;
};

export default PassNPlayBoard;
