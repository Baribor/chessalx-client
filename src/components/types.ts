import { MODAL_TYPE } from "./constants";

export type User = {
	email?: string;
	id: string;
	profilePic?: string | null;
	role?: string;
	token?: string;
	username: string;
	activeGame?: Game;
}

export type Game = {
	whitePlayer: User;
	blackPlayer: User;
	id: number;
}

export type ModalState = {
	type: MODAL_TYPE;
	data?: unknown;
}