import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import SafetyDividerIcon from '@mui/icons-material/SafetyDivider';
import SendIcon from '@mui/icons-material/Send';

const ChatSideBar = () => {

	return (
		<>
			<div className='py-10 pl-4 lg:visible invisible'>
				<div className='bg-primary200 h-full flex flex-col rounded-lg overflow-hidden'>
					<div className='flex-grow flex flex-col'>
						<div className='flex-grow'>

						</div>
						<div className='flex gap-2 justify-center bg-primaryDark py-2'>
							<input type="text" className='w-2/3' />
							<span className='text-white cursor-pointer'><SendIcon /></span>
						</div>
					</div>
					<div className='border-t flex justify-center gap-4 bg-primaryDark text-white py-2'>
						<span title='abort'><CloseIcon fontSize='large' /></span>
						<span title='offer draw'><SafetyDividerIcon fontSize='large' /></span>
						<span title='resign'><FlagIcon fontSize='large' /></span>
					</div>
				</div>
			</div>
		</>
	)
}

export default ChatSideBar;