import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
import GeneralRequests from "./GeneralRequests";

const Header = () => {
	const router = useRouter();

	console.log("router", router);
	const [toggleOpen, setToggleOpen] = useState(false);

	const userData = useJujuStore((state: any) => state.userData);
	const userID = useJujuStore((state: any) => state.userID);
	const updateUserData = useJujuStore((state: any) => state.updateUserData);
	const userSigned = useJujuStore((state: any) => state.userSigned);
	const updateUserSigned = useJujuStore((state: any) => state.updateUserSigned);
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
								toast.success("User Login Successful");
								updateUserSigned(true);
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
			if (!address) toast.error(err.message);

			/*
			Disconnect wallet here:
			note that I had to reset the rainbowkit key to dismiss the connect modal. Weird rainbowKit bug
			Ref: https://github.com/rainbow-me/rainbowkit/issues/686#issuecomment-1295798813
			*/
			// if (!address)

			disconnect().then(() => {
				updateRainbowKey(new Date().getTime());
			});
			updateUserSigned(false);
		},
	});

	useEffect(() => {
		updateUserSigned(false);
		if (address && !messageLoading && !messageError && userID === undefined) {
			console.log("address", address);
			console.log("message", message);
			//comment this out when testing
			signMessage();
		}
		if (address && !messageLoading && !messageError && userID)
			updateUserSigned(true);

		if (!address) updateUserSigned(false);
	}, [address, messageLoading, userID]);

	const routesList = [
		{ name: "Home", route: "/" },
		{ name: "Exchange", route: "/exchange" },
		{ name: "Pool", route: "/pool" },
		{ name: "Stats", route: "/stats" },
		{ name: "Docs", route: "/docs" },
		{ name: "FAQ", route: "/FAQ" },
		{ name: "Settings", route: "/settings" },
	];

	const filteredRoutes = userSigned
		? routesList
		: routesList.filter((route) => route.name !== "Settings");

	return (
		<header className={styles.Header}>
			{/* This styles the Rainbowkit button  */}
			<style global jsx>
				{`
					.styles_Header__SFkYf .iekbcc0.ju367v1n.ju367v1n {
						height: 55px;
					}
					.styles_Header__SFkYf
						.iekbcc0.iekbcc9.ju367v73.ju367v7o.ju367v9c.ju367vn.ju367vec.ju367vex.ju367v11.ju367v1c.ju367v2b.ju367v8o._12cbo8i3.ju367v8m._12cbo8i4._12cbo8i6 {
						height: 55px;
						font-family: "Euclid Circular A";
						font-weight: 400;
						font-size: 18px;
						line-height: 23px;
						color: #ffffff;
						padding: 1rem 2rem;
						background: linear-gradient(
							302.87deg,
							#26d0ce -18.22%,
							#1a2980 101.04%
						);
						border-radius: 6px;
						border: 0;
						cursor: pointer;
					}

					@media screen and (max-width: 1024px) {
						.styles_Header__SFkYf .iekbcc0.ju367v1n.ju367v1n {
							height: 2rem;
						}
						.styles_Header__SFkYf
							.iekbcc0.iekbcc9.ju367v73.ju367v7o.ju367v9c.ju367vn.ju367vec.ju367vex.ju367v11.ju367v1c.ju367v2b.ju367v8o._12cbo8i3.ju367v8m._12cbo8i4._12cbo8i6 {
							font-weight: 400;
							font-size: 12px;
							line-height: 15px;

							color: #ffffff;
							padding: 0.5rem 0.75rem;

							border-radius: 4px;
							height: 2rem;
						}
					}
				`}
			</style>

			<div>
				<Link href="/">
					<JujuLogo />
				</Link>
				<ul className={styles.Header__routes}>
					{filteredRoutes.map(
						(item, ind) =>
							item && (
								<li
									className={`${styles.Header__routes__routeItem} ${
										router.pathname.startsWith(item.route) &&
										item.name !== "Home"
											? styles["Header__routes__routeItem--active"]
											: ""
									} ${
										router.pathname === "/" && item.name === "Home"
											? styles["Header__routes__routeItem--active"]
											: ""
									}`}
									key={item.route}
								>
									<Link href={item.route}>{item?.name}</Link>
								</li>
							)
					)}
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
			<GeneralRequests />
		</header>
	);
};

// export default Header;
export default dynamic(() => Promise.resolve(Header), { ssr: false });
