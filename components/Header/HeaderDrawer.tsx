import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import { JujuLogo } from "../svgs";
import { Drawer } from "@mui/material";
import { MdOutlineClose } from "react-icons/md";
import Button from "../Button";
import { BsTwitter, BsGithub } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box } from "@mui/material";
import { customSX } from "../../constants";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { toggleSideDrawer } from "../../utils/helperFuncs";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useJujuStore } from "@/zustand/store";

const HeaderDrawer = ({
	toggleOpen,
	setToggleOpen,
	routesList,
}: {
	toggleOpen: boolean;
	setToggleOpen: any;
	routesList: any;
}) => {
	//zustand
	const userSigned = useJujuStore((state: any) => state.userSigned);

	const router = useRouter();

	const { address } = useAccount();

	const routesList_1 = [
		{ name: "Home", route: "/" },
		{ name: "Exchange", route: "/exchange" },
		{ name: "Pool", route: "/pool" },
		{ name: "Stats", route: "/stats" },
		{ name: "FAQ", route: "/FAQ" },
	];
	const routesList_2 = [
		{ name: "Docs", route: "/docs" },
		{ name: "Privacy Policy", route: "/privacy-policy" },
		{ name: "Settings", route: "/settings" },
	];

	const filteredRoutes_2 = userSigned
		? routesList_2
		: routesList_2.filter((route) => route.name !== "Settings");

	const socialLinks = [
		{ icon: <BsTwitter color="#1F2832" />, link: "/" },
		{ icon: <BsGithub color="#1F2832" />, link: "/" },
		{ icon: <FaDiscord color="#1F2832" />, link: "/" },
	];

	return (
		<SwipeableDrawer
			anchor={"right"}
			open={toggleOpen}
			onClose={toggleSideDrawer(false, setToggleOpen)}
			onOpen={toggleSideDrawer(true, setToggleOpen)}
			sx={{
				".MuiDrawer-paper": {
					width: "58.7vw",
					borderTopLeftRadius: "40px",
					borderBottomLeftRadius: "40px",
				},
			}}
		>
			<div className={styles.mobileNav}>
				<div className={styles.mobileNav__miniheader}>
					<span
						onClick={() => {
							router.push("/");
							setToggleOpen(false);
						}}
					>
						<JujuLogo />
					</span>
					{/* <div
						className={styles.closeBtn}
						onClick={() => {
							setToggleOpen(false);
						}}
					>
						Close
						<MdOutlineClose />
					</div> */}
				</div>
				<ul>
					{routesList_1.map((routeItem: any, ind: number) => (
						<li
							className={`${styles.mobileNav__routeItem} ${
								router.pathname.startsWith(routeItem.route) &&
								routeItem.name !== "Home"
									? styles["mobileNav__routeItem--active"]
									: ""
							} ${
								router.pathname === "/" && routeItem.name === "Home"
									? styles["mobileNav__routeItem--active"]
									: ""
							}`}
							onClick={() => {
								router.push(routeItem.route);
								setToggleOpen(false);
							}}
							key={ind}
						>
							{routeItem?.name}
						</li>
					))}
				</ul>
				<ul>
					{filteredRoutes_2.map((routeItem: any, ind: number) => (
						<li
							className={`${styles.mobileNav__routeItem} ${
								router.pathname.startsWith(routeItem.route) &&
								routeItem.name !== "Home"
									? styles["mobileNav__routeItem--active"]
									: ""
							} ${
								router.pathname === "/" && routeItem.name === "Home"
									? styles["mobileNav__routeItem--active"]
									: ""
							}`}
							onClick={() => {
								router.push(routeItem.route);
								setToggleOpen(false);
							}}
							key={ind}
						>
							{routeItem?.name}
						</li>
					))}
				</ul>
				<div className={styles.socialBottom}>
					<p>Follow juju swap</p>
					<div className={styles.socialBottom__links}>
						{socialLinks.map((item, ind) => (
							<div key={ind}>{item.icon}</div>
						))}
					</div>
				</div>

				<div className={styles.btnWrap}>{/* <MyButtonn /> */}</div>
			</div>
		</SwipeableDrawer>
	);
};

// export default HeaderDrawer;
export default dynamic(() => Promise.resolve(HeaderDrawer), { ssr: false });

export const MyButtonn = () => {
	return (
		<Box sx={customSX}>
			<ConnectButton
				// accountStatus={{
				// 	smallScreen: "avatar",
				// 	largeScreen: "full",
				// }}
				showBalance={false}
				chainStatus="full"
			/>
		</Box>
	);
};
