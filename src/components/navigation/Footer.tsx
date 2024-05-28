import { Link } from "react-router-dom";


const Footer = () => {

	return (
		<>
			<footer className="tw-flex tw-flex-col tw-items-center tw-bg-primaryLight tw-text-white tw-border-t-2 tw-border-black tw-h-[64px]">
				<ul className="tw-flex tw-list-none tw-gap-4">
					<li><Link to="/about" className="tw-text-inherit">About</Link></li>
					<li><Link to="/contact" className="tw-text-inherit">Contact us</Link></li>
					<li><Link to="#" className="tw-text-inherit">Source code</Link></li>
				</ul>
				<p>Copyright &copy; 2024</p>
			</footer>
		</>
	)
}

export default Footer;