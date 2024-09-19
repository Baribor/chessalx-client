import { Link } from "react-router-dom";


const Footer = () => {

	return (
		<>
			<footer className="flex flex-col items-center bg-primaryLight text-white border-t border-primary200 h-[64px]">
				<ul className="flex list-none gap-4">
					<li><Link to="/about" className="text-inherit">About</Link></li>
					<li><Link to="/contact" className="text-inherit">Contact us</Link></li>
					<li><Link to="#" className="text-inherit">Source code</Link></li>
				</ul>
				<p>Copyright &copy; 2024</p>
			</footer>
		</>
	)
}

export default Footer;