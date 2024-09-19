import { FC } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ModalProps } from "../interfaces";

const ModalLayout: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded shadow-lg w-1/3">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl">{title}</h2>
					<button onClick={onClose} className="text-red-500">
						<CloseIcon />
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	)
}

export default ModalLayout;