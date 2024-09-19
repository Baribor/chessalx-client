import { ReactNode } from "react";
import { User } from "./types";

export interface ModalProps {
	isOpen: boolean;
	onClose?: () => void;
	title?: string;
	children?: ReactNode;
}

export interface GameState {
	moves: string[];
	sideToMove: string,
	side?: string,
	isGameOver: boolean;
	whitePlayer?: User;
	blackPlayer?: User;
	id?: string;
	fen?: string;
	pgn?: string;
}
