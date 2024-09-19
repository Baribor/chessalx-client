/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { calcWidth } from "../utils";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { gameState } from "../store/boardState";
import UserSearchBoard from "../unit/UserSearchBoard";
import { userState } from "../store/userState";
import { useNavigate } from "react-router-dom";

declare global {
	interface Window {
		STOCKFISH: any;
	}
}

const game = new Chess();

type Props = {
	children?: (props: { position: string; onDrop: (arg: { sourceSquare: string; targetSquare: string }) => Promise<void> | void }) => React.ReactNode;
};

const OnlineBoard: React.FC<Props> = () => {
	const [fen, setFen] = useState("start");
	const setGameState = useSetRecoilState(gameState);
	const user = useRecoilValue(userState);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/login?next=/online', {
				replace: true,
			})
		}
	}, [])

	useEffect(() => {
		setGameState({
			isGameOver: false,
			moves: [],
			sideToMove: 'white',
		})
		setFen(game.fen());
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
				moves: game.history()
			}))
			resolve();
		});
	}, []);


	return <>
		<div className="lg:grid lg:grid-cols-2 lg:grid-rows-1 h-full gap-4">
			<div className="flex items-center justify-center mr-4 w-full">
				<div className="border-4 rounded-md border-red-900 w-fit">
					<Chessboard
						position={fen}
						calcWidth={calcWidth}
						onDrop={onDrop}
						orientation="black"
						boardStyle={{
							borderRadius: "5px",
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
						}}
					/>
				</div>
			</div>
			<UserSearchBoard />
		</div>

	</>;
};

export default OnlineBoard;
