import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { axiosInstance, ENDPOINTS, pusher } from '../constants';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../store/userState';
import { Game } from '../types';
import { getFullURL } from '../utils';
import { gameState } from '../store/boardState';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';

export default function GameRequestModal() {
	const [user, setUser] = useRecoilState(userState);
	const [request, setRequest] = useState<Game>();
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
	}, [])

	const handleCancelRequest = () => {
		setRequest(undefined);
	}

	const handleAcceptRequest = async () => {
		const response = await axiosInstance.post(getFullURL(ENDPOINTS.acceptGame), {
			gameId: request?.id,
		}, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});

		if (response.data.status) {
			const { id, whitePlayerId, whitePlayer, blackPlayer } = response.data.data;
			setGameState((cur) => ({
				...cur,
				id: id,
				moves: [],
				fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
				sideToMove: whitePlayerId === response.data.data.id ? 'white' : 'black',
				whitePlayer,
				blackPlayer,
			}));
			navigate('/passNplay');
			setRequest(undefined);
		}
	}

	useEffect(() => {

		if (user) {
			pusher.user.bind("game-request", (data: Game) => {
				setRequest(data);
			});

			pusher.user.bind("request-accepted", () => {
				getUserData();
			});
		}

	}, []);


	return (
		<Dialog open={Boolean(request)}>
			<DialogTitle>Incoming Game request</DialogTitle>
			<div className='flex items-center gap-1 p-4'>
				<span className='text-inherit'><AccountCircleIcon fontSize='large' /></span>
				<span>{request?.whitePlayer.username}</span>
			</div>
			<div className='flex justify-between p-2'>
				<Button variant='contained' color='error' onClick={handleCancelRequest}>Cancel</Button>
				<Button variant='contained' onClick={handleAcceptRequest}>Accept</Button>
			</div>
		</Dialog>
	)
}