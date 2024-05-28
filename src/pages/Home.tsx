import Chessboard from "chessboardjsx";

const Home = () => {

	const calcWidth = (data: { screenWidth: number, screenHeight: number }): number => {
		if (data.screenWidth < 500) {
			return Math.floor(data.screenWidth * 0.9);
		}
		return 460;
	}
	return (
		<>
			<div className="tw-flex tw-justify-center tw-items-center tw-h-full">
				<div id="board1" className="tw-w-[400px]">
					<Chessboard position="start" calcWidth={calcWidth} />
				</div>
			</div>
		</>
	)
}

export default Home;