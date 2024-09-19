import { useRecoilValue } from "recoil";
import { gameState } from "../store/boardState";
import { userState } from "../store/userState";


const MoveSideBar = ({ side }: { side: string }) => {
	const state = useRecoilValue(gameState);
	const user = useRecoilValue(userState);

	const getMoves = () => {
		if (!state)
			return null;
		const moves = [];

		for (let i = 0; i < state.moves.length; i += 2) {
			moves.push(<span key={`${i}a`}>{Math.ceil(i / 2) + 1}</span>)
			moves.push(<span key={`${i}b`}>{state.moves[i]}</span>)
			moves.push(<span key={`${i}c`}>{state.moves[i + 1] ?? ""}</span>)
		}
		return moves;
	}
	return (
		<>
			<div className=" p-4 flex flex-col justify-center invisible lg:visible">
				<div className={`${side !== state.sideToMove[0] ? 'bg-primary' : 'bg-primary200'} w-fit p-2 text-3xl`}>
					<p className="h-4 w-12"></p>
				</div>
				<div className="bg-primary200 p-2 h-2/3 flex flex-col">
					<p className="text-end font-bold">{state.blackPlayer?.id === user?.id ? state.whitePlayer?.username : state.blackPlayer?.username}</p>
					<div className="flex-grow bg-white overflow-auto px-3">
						<div className="grid grid-cols-3">
							{
								getMoves()
							}
						</div>
					</div>
					<p className="text-end font-bold">{state.blackPlayer?.id === user?.id ? state.blackPlayer?.username : state.whitePlayer?.username}</p>
				</div>
				<div className={`${side === state.sideToMove[0] ? 'bg-primary' : 'bg-primary200'} w-fit p-2 text-3xl`}>
					<p className="h-4 w-12"></p>
				</div>
			</div>
		</>
	)
}

export default MoveSideBar;