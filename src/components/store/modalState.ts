import { atom } from "recoil";
import { ModalState } from "../types";

export const modalState = atom<ModalState | null>({
	key: 'MODAL_STATE',
	default: null,
});