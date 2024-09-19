import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from 'react';
import { axiosInstance, ENDPOINTS, } from '../constants';
import { User } from '../types';
import { getFullURL } from '../utils';
import { CircularProgress } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type OpenFunc = (user: User | undefined) => void;

export default function RequestGameModal({ user, setOpen }: { user: User, setOpen: OpenFunc }) {
	const [requesting, setRequesting] = useState(true);


	useEffect(() => {
		const handleRequest = async () => {
			await axiosInstance.post(getFullURL(ENDPOINTS.requestGame), {
				username: user.username,
			}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			setRequesting(false);
		}
		handleRequest();
	}, [])
	return (
		<Dialog open={Boolean(user)}>
			<DialogTitle sx={{ m: 0, p: 2 }}>{
				requesting ? "Requesting game" : 'Request sent'
			}</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={() => setOpen(undefined)}
				sx={(theme) => ({
					position: 'absolute',
					right: 8,
					top: 8,
					color: theme.palette.grey[500],
				})}
			>
				<CloseIcon />
			</IconButton>
			<div className='flex items-center gap-1 p-4'>
				<span className='text-inherit'><AccountCircleIcon fontSize='large' /></span>
				<span>{user.username}</span>
			</div>
			{
				requesting && <div className='flex justify-center p-2'>
					<CircularProgress />
				</div>
			}
		</Dialog>
	)
}