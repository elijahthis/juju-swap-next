import { JujuLogo } from "../svgs";
import { BsTwitter, BsGithub } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";

export const Footer = () => {
	const router = useRouter();

	const routesList = [
		{ name: "Home", route: "/" },
		{ name: "Exchange", route: "/exchange" },
		{ name: "Docs", route: "/Docs" },
		{ name: "Pool", route: "/pool" },
		{ name: "Privacy policy", route: "/privacy-policy" },
	];

	const socialLinks = [
		{ icon: <BsTwitter color="#1F2832" />, link: "/" },
		{ icon: <BsGithub color="#1F2832" />, link: "/" },
		{ icon: <FaDiscord color="#1F2832" />, link: "/" },
	];

	return (
		<footer className={styles.Footer}>
			<div>
				<JujuLogo />
				<ul className={styles.Footer__routes}>
					{routesList.map((routeItem, ind) => (
						<li
							className={`${styles.Footer__routes__routeItem} ${
								router.pathname.startsWith(routeItem.route) &&
								routeItem.name !== "Home"
									? styles["Footer__routes__routeItem--active"]
									: ""
							} ${
								router.pathname === "/" && routeItem.name === "Home"
									? styles["Footer__routes__routeItem--active"]
									: ""
							}`}
							key={ind}
						>
							<Link href={routeItem.route}>{routeItem.name}</Link>
						</li>
					))}
				</ul>
				<div className={styles.socialLinks}>
					{socialLinks.map((item, ind) => (
						<div key={ind}>{item.icon}</div>
					))}
				</div>
			</div>
		</footer>
	);
};
