import { Outlet, useNavigate } from "react-router-dom"
import Header from "../navigation/Header"
import Footer from "../navigation/Footer"
import { useSetRecoilState } from "recoil"
import { userState } from "../store/userState"
import { useCallback, useEffect, useState } from "react"
import { CircularProgress } from "@mui/material"
import { axiosInstance, ENDPOINTS, pusher } from "../constants"
import { getFullURL } from "../utils"
import GameRequestModal from "../modal/GameRequestModal"
import StartGameModal from "../modal/StartGameModal"
import { gameState } from "../store/boardState"
import { Chess } from "chess.js"


const MainLayout = () => {
	const setUser = useSetRecoilState(userState);
	const [loading, setLoading] = useState(true);
	const setGameState = useSetRecoilState(gameState);
	const navigate = useNavigate();

	const getUserData = useCallback(async () => {
		const token = localStorage.getItem('token');

		if (token) {
			const response = await axiosInstance.get(getFullURL(ENDPOINTS.getProfile), {
				headers: {
					Authorization: 'Bearer ' + token
				}
			});

			if (response.data.status) {
				setUser(response.data.data);
				if (response.data.data.activeGame) {
					const { id, pgn, fen, whitePlayerId, whitePlayer, blackPlayer } = response.data.data.activeGame;
					const game = new Chess();
					pgn ? game.loadPgn(pgn) : game.load(fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
					setGameState((cur) => ({
						...cur,
						id: id,
						moves: game.history(),
						fen,
						pgn,
						sideToMove: whitePlayerId === response.data.data.id ? 'white' : 'black',
						whitePlayer,
						blackPlayer,
					}));
					navigate('/passNplay');
				}
			}
		}
		setLoading(false);
	}, [])

	useEffect(() => {
		pusher.signin();
		getUserData();
	}, []);
	return loading ? (
		<>
			<main className="bg-primaryLight h-screen flex justify-center items-center">
				<p className="bg-white p-4 rounded-full">
					<CircularProgress />
				</p>
			</main>
		</>
	) : (
		<>
			<Header />
				<main className="bg-primaryLight h-[calc(100vh-124px)]">
					<Outlet />
					<GameRequestModal />
					<StartGameModal />
				</main>
			<Footer />
		</>


	)
}

export default MainLayout;