import { Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRecoilValue } from "recoil";
import { userState } from "../store/userState";

export default function ProfileIcon() {
	const user = useRecoilValue(userState);

	return user ? (
		<div className='flex items-center gap-1'>
			<Link to="/profile" className='text-inherit'><AccountCircleIcon fontSize='large' /></Link>
			<span>{user.username}</span>
		</div>
	) : null;
}