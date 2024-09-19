import { useNavigate } from "react-router-dom";
import RandomVsRandomBoard from "../components/board/RandomVsRandom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../components/store/userState";
import { modalState } from "../components/store/modalState";
import { MODAL_TYPE } from "../components/constants";

const Home = () => {
	const navigate = useNavigate();
	const user = useRecoilValue(userState);
	const setModal = useSetRecoilState(modalState);

	const handleGetStartedClicked = () => {
		if (!user) {
			navigate('/login')
		} else {
			setModal({
				type: MODAL_TYPE.startGame
			});
		}
	}
	return (
		<>
			<div className="grid grid-cols-2 h-[calc(100vh-120px)]">
				<div className="p-4 flex flex-col justify-center gap-4">
					<h1 className="text-5xl font-bold">Welcome to Chessalx</h1>
					<p>Play. Learn. Compete.</p>
					<p>Whether you're a beginner learning the rules or a seasoned grandmaster looking to sharpen your skills, ChessMaster is your ultimate destination for online chess.</p>

					<div className="bg-primaryDark text-white text-center rounded-full p-3 text-lg w-fit px-8 cursor-pointer self-end" onClick={handleGetStartedClicked}>
						<span>{user ? 'Start Game' : 'Get Started'}</span>
					</div>
				</div>
				<div className="flex items-center justify-center">
					<RandomVsRandomBoard />
				</div>
			</div>
		</>
	)
}

export default Home;