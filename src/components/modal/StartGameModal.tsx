import { useRecoilState } from "recoil";
import ModalLayout from "./ModalLayout"
import { useNavigate } from "react-router-dom";
import { modalState } from "../store/modalState";
import { MODAL_TYPE } from "../constants";


const StartGameModal = () => {
	const [modal, setModalState] = useRecoilState(modalState);
	const navigate = useNavigate();

	const handleNavigate = (type: string) => {
		if (type === 'pass') {
			navigate('/passNplay');
		}
		else if (type === 'online') {
			navigate('/online');
		}
		else if (type === 'computer') {
			navigate('/computer');
		}
		setModalState(null);
	}
	return (
		<ModalLayout isOpen={modal?.type === MODAL_TYPE.startGame} onClose={() => setModalState(null)}>
			<div className="flex flex-col gap-4">
				<div className="bg-primary py-3 rounded-full flex justify-center text-white text-lg cursor-pointer font-bold" onClick={() => handleNavigate('online')}>
					<span>Online</span>
				</div>
				<div className="bg-primary py-3 rounded-full flex justify-center text-white text-lg cursor-pointer font-bold" onClick={() => handleNavigate('computer')}>
					<span>Computer</span>
				</div>
				<div className="bg-primary py-3 rounded-full flex justify-center text-white text-lg cursor-pointer font-bold" onClick={() => handleNavigate('pass')}>
					<span>Pass N Play</span>
				</div>
			</div>
		</ModalLayout>
	)
}

export default StartGameModal;