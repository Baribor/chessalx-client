import { atom } from "recoil";
import { GameState } from "../interfaces";

export const gameState = atom<GameState>({
	key: 'playMoves',
	default: {
		sideToMove: 'white',
		moves: [],
		isGameOver: false,
		fen: '',
		pgn: '',
		side: 'w',
	},
})