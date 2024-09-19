import { Link } from 'react-router-dom';
import ProfileIcon from '../unit/ProfileIcon';
import AuthButtons from '../unit/AuthButtons';
import { useSetRecoilState } from 'recoil';
import { modalState } from '../store/modalState';
import { MODAL_TYPE } from '../constants';

const Header = () => {
	const setModal = useSetRecoilState(modalState);

	const toggleModal = () => {
		setModal({
			type: MODAL_TYPE.startGame
		})
	}
	return (
		<>
			<header className="bg-primaryDark flex text-white justify-between w-full items-center h-[64px] z-10">
				<div className='p-3'>
					<Link to="/"><p className='text-2xl font-extrabold font-[cursive] text-white'>Chessalx</p></Link>
				</div>

				<div className='flex items-center p-3 gap-2'>
					<div>
						<span className='hover:bg-primary200 py-1 px-6 hover:rounded-full hover:text-primaryDark font-bold cursor-pointer duration-150 text-xl' onClick={toggleModal}>Play</span>
					</div>
					<div className='flex gap-4'>
						<AuthButtons />
					</div>
					<ProfileIcon />
				</div>
			</header>
		</>
	);
}

export default Header;