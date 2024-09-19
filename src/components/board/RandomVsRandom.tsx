import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useEffect, useRef, useState } from "react";
import { calcWidth } from "../utils";


const RandomVsRandomBoard = () => {
	const [state, setState] = useState({ fen: "start" });
	const game = useRef(new Chess());

	const timer = () => window.setTimeout(makeRandomMove, 1000);

	const makeRandomMove = () => {
		const possibleMoves = game.current.moves();

		if (game.current.isGameOver() || game.current.isDraw() || possibleMoves.length === 0) {
			setState({ fen: "start" });
			timer();
		}

		const randomIndex = Math.floor(Math.random() * possibleMoves.length);
		game.current.move(possibleMoves[randomIndex]);
		setState({ fen: game.current.fen() });

		timer();
	}

	useEffect(() => {
		timer()
		return () => window.clearTimeout(timer());
	}, []);

	return (
		<div className="border-4 rounded-md border-red-900 w-fit">
			<Chessboard calcWidth={calcWidth} position={state.fen} transitionDuration={300} />
		</div>
	)
}

export default RandomVsRandomBoard;