import { useEffect, useState } from "react";
import { JujuLogo } from "../svgs";
import Button from "../Button";
import styles from "./styles.module.scss";
import { CgMenuLeft } from "react-icons/cg";
import HeaderDrawer from "./HeaderDrawer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_MESSAGE, VERIFY_SIGNATURE } from "../../graphql/queries";
import { useSignMessage } from "wagmi";
import { disconnect } from "@wagmi/core";
import { ADD_USER } from "../../graphql/mutations";
import { useJujuStore } from "../../zustand/store";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";

const Header = () => {
	const router = useRouter();

	const routesList = [
		{ name: "Home", route: "/" },
		{ name: "Exchange", route: "/exchange" },
		{ name: "Pool", route: "/pool" },
		{ name: "Stats", route: "/stats" },
		{ name: "Docs", route: "/docs" },
		{ name: "FAQ", route: "/FAQ" },
	];
	console.log("router", router);
	const [toggleOpen, setToggleOpen] = useState(false);

	const userData = useJujuStore((state: any) => state.userData);
	const updateUserData = useJujuStore((state: any) => state.updateUserData);
	const rainbowKey = useJujuStore((state: any) => state.rainbowKey);
	const updateRainbowKey = useJujuStore((state: any) => state.updateRainbowKey);

	const { address } = useAccount();

	const {
		loading: messageLoading,
		error: messageError,
		data: message,
	} = useQuery(GET_MESSAGE);

	const [
		triggerVerify,
		{ loading: verifyLoading, error: verifyError, data: verifyData },
	] = useLazyQuery(VERIFY_SIGNATURE);

	const [addUserMutation] = useMutation(ADD_USER);

	const {
		data: signatureHash,
		error,
		isLoading,
		signMessage,
	} = useSignMessage({
		message: message?.getMessage,
		onSuccess(data, variables) {
			console.log("signatureHash", data);

			// Verify signature when sign message succeeds
			triggerVerify({
				variables: {
					message: message?.getMessage,
					address: address,
					signatureHash: data,
				},
				onCompleted(trigData) {
					console.log("verifyData", trigData);
					if (trigData?.verifySignature)
						addUserMutation({
							variables: {
								signature: data,
								address: address,
							},
							onCompleted(data) {
								console.log("data", data);
								updateUserData(data);
								toast.success("User Login Successful");
							},
							onError(error) {
								console.log(error);
								console.log("payload", {
									signature: data,
									address: address,
								});
								toast.error(error.message);
							},
						});
				},
			});
		},
		onError(err) {
			console.log("err", err);
			toast.error(err.message);

			/*
			Disconnect wallet here:
			note that I had to reset the rainbowkit key to dismiss the connect modal. Weird rainbowKit bug
			Ref: https://github.com/rainbow-me/rainbowkit/issues/686#issuecomment-1295798813
			*/
			disconnect().then(() => {
				updateRainbowKey(new Date().getTime());
			});
		},
	});

	useEffect(() => {
		if (address && !messageLoading && !messageError) {
			console.log("address", address);
			console.log("message", message);
			//comment this out when testing
			signMessage();
		}
	}, [address, messageLoading]);

	return (
		<header className={styles.Header}>
			<div>
				<Link href="/">
					<JujuLogo />
				</Link>
				<ul className={styles.Header__routes}>
					{routesList.map((item, ind) => (
						<li
							className={`${styles.Header__routes__routeItem} ${
								router.pathname.startsWith(item.route) && item.name !== "Home"
									? styles["Header__routes__routeItem--active"]
									: ""
							} ${
								router.pathname === "/" && item.name === "Home"
									? styles["Header__routes__routeItem--active"]
									: ""
							}`}
							key={ind}
						>
							<Link href={item.route}>{item?.name}</Link>
						</li>
					))}
				</ul>
				<div className={styles.btnWrap}>
					<ConnectButton
						accountStatus={{
							smallScreen: "avatar",
							largeScreen: "full",
						}}
						showBalance={false}
						chainStatus="icon"
					/>
					{/* <span></span> */}
					<div onClick={() => setToggleOpen(true)}>
						<CgMenuLeft />
					</div>
				</div>
			</div>
			<HeaderDrawer
				toggleOpen={toggleOpen}
				setToggleOpen={setToggleOpen}
				routesList={routesList}
			/>
		</header>
	);
};

export default Header;
