import SearchIcon from '@mui/icons-material/Search';
import { useFormik } from 'formik';
import * as yup from "yup";
import { axiosInstance, ENDPOINTS } from '../constants';
import { getFullURL } from '../utils';
import { useState } from 'react';
import { User } from '../types';
import { Button, CircularProgress } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RequestGameModal from '../modal/RequestGameModal';

const validationSchema = yup.object({
	username: yup.string().required(),
});

export default function UserSearchBoard() {
	const [users, setUsers] = useState<User[]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<User>();

	const formik = useFormik({
		validationSchema,
		initialValues: {
			username: ''
		},
		onSubmit: async (values, helper) => {
			const response = await axiosInstance.get(getFullURL(ENDPOINTS.searchUsers + new URLSearchParams({
				username: values.username
			})), {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			if (response.status) {
				setUsers(response.data.data);
			}

			helper.setSubmitting(false);
		}
	})

	const handlePlayPlayer = (user: User) => {
		setCurrentPlayer(user);
	}
	return (
		<div className='flex flex-col mr-4 w-full pt-20 bg-gray-300 px-4'>
			<div className='bg-white flex rounded-full pl-2 w-[320px] overflow-hidden self-center'>
				<input type="text" name="username" className='outline-none flex-grow border-none' placeholder='enter username' value={formik.values.username} onChange={formik.handleChange} />
				<span className='p-1 cursor-pointer bg-accent' onClick={() => formik.handleSubmit()}>
					<SearchIcon />
				</span>
			</div>
			<div className='relative mt-4'>
				{
					users.length > 0 ? (
						<ul >
							{
								users.map((user) => (
									<li key={user.id} className='flex justify-between'><p><span className='text-inherit'><AccountCircleIcon fontSize='large' /></span>
										<span>{user.username}</span></p> <Button variant='contained' onClick={() => handlePlayPlayer(user)}>Play</Button></li>
								))
							}
						</ul>
					) : (
						<p className='font-bold'>No player found.</p>
					)
				}
				{
					formik.isSubmitting && <p className='flex justify-center absolute right-[50%] translate-x-[-50%] z-10'>
						<CircularProgress />
					</p>
				}
			</div>

			{
				currentPlayer && <RequestGameModal user={currentPlayer} setOpen={(user: User | undefined) => setCurrentPlayer(user)} />
			}

		</div>
	)
}