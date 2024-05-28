import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';

const Header = () => {
	return (
		<>
			<header className="tw-bg-primaryDark tw-flex tw-text-white tw-justify-between tw-w-full tw-items-center tw-h-[64px]">
				<div className='tw-p-3'>
					<Link to="/"><p className='tw-text-2xl tw-font-extrabold tw-font-[cursive] tw-text-white'>Chessalx</p></Link>
				</div>

				<div>
					<div className='tw-bg-white tw-flex tw-rounded-full tw-pl-2 tw-w-[320px] tw-overflow-hidden'>
						<input type="text" name="search" className='tw-outline-none tw-flex-grow tw-border-none' placeholder='enter username' />
						<span className='tw-p-1 tw-cursor-pointer tw-bg-accent'>
							<SearchIcon />
						</span>
					</div>
				</div>
				<div className='tw-flex tw-items-center tw-p-3 tw-gap-2'>
					<div>
						<span className='hover:tw-bg-primary200 tw-py-1 tw-px-6 hover:tw-rounded-full hover:tw-text-primaryDark tw-font-bold tw-cursor-pointer tw-duration-150 tw-text-xl'>Play</span>
					</div>
					<div className='tw-flex tw-gap-4'>
						<Link to="/login" className='tw-rounded-full tw-py-1 tw-px-2 tw-bg-primary200 tw-text-primaryDark'>Login</Link>
						<Link to="signup" className='tw-rounded-full tw-py-1 tw-px-2 tw-bg-primary200 tw-text-primaryDark'>Signup</Link>
					</div>
					<div className='tw-flex tw-items-center tw-gap-1'>
						<Link to="/profile" className='tw-text-inherit'><AccountCircleIcon fontSize='large' /></Link>
						<span>CurvsyDev</span>
					</div>
				</div>
			</header>
		</>
	);
}

export default Header;