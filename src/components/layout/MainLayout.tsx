import { Outlet } from "react-router-dom"
import Header from "../navigation/Header"
import Footer from "../navigation/Footer"


const MainLayout = () => {

	return (
		<>
			<Header />
			<main className="tw-bg-primaryLight tw-h-[calc(100vh-124px)]">
				<Outlet />
			</main>
			<Footer />
		</>
	)
}

export default MainLayout;