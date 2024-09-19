import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../store/userState";

export default function AuthButtons() {
	const [user, setUser] = useRecoilState(userState);
	const handleLogout = () => {
		localStorage.removeItem('token');
		setUser(null);
	}
	return user ? (
		<>
			<span className='rounded-full py-1 px-2 bg-primary200 text-primaryDark cursor-pointer' onClick={handleLogout}>Logout</span>
		</>
	) : (
		<>
			<Link to="/login" className='rounded-full py-1 px-2 bg-primary200 text-primaryDark'>Login</Link>
			<Link to="signup" className='rounded-full py-1 px-2 bg-primary200 text-primaryDark'>Signup</Link>
		</>
	)
}