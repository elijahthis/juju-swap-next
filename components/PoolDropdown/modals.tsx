import { BiChevronDown } from "react-icons/bi";
import styles from "./styles.module.scss";
import wngn from "../../assets/images/wngn.svg";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { IoCopy, IoCheckmarkCircleSharp } from "react-icons/io5";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import MUIModal from "../MUIModal";
import AssetSelect from "../AssetSelect";
import { RiErrorWarningLine } from "react-icons/ri";
import Button from "../Button";
import MUISlider from "../MUISlider";
import { useLazyQuery, useQuery } from "@apollo/client";
import {
	useNetwork,
	useAccount,
	usePrepareSendTransaction,
	useSendTransaction,
	useWaitForTransaction,
} from "wagmi";
import {
	GET_POOL_USER_DATA,
	GET_CHAIN_SUPPORTED_TOKENS,
	GET_AGGREGATE_RATE,
	GET_ADD_LIQUIDITY_QUOTE,
	GET_ADD_LIQUIDITY_QUOTE_TX,
	GET_REMOVE_LIQUIDITY_QUOTE,
	GET_REMOVE_LIQUIDITY_QUOTE_TX,
} from "../../graphql/queries";
import { Spinner } from "@chakra-ui/react";
import { toast } from "react-toastify";

export const PoolDropdownModal = ({
	setAddModalOpen,
	poolData,
	setModal1Open,
}: {
	setAddModalOpen: any;
	poolData: any;
	setModal1Open: any;
}) => {
	const [copied, setCopied] = useState(false);
	const [poolUserObj, setPoolUserObj] = useState<any>({});
	const [removeModalOpen, setRemoveModalOpen] = useState(false);

	const { address } = useAccount();
	const { chain } = useNetwork();

	const {
		loading: PoolUserLoading,
		data: PoolUserData,
		error: PoolUserError,
	} = useQuery(GET_POOL_USER_DATA, {
		variables: { chainId: chain?.id, pool: poolData?.address, user: address },
	});

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!PoolUserError && !PoolUserLoading) {
					console.log("PoolUserData", PoolUserData?.getPoolUserData);
					setPoolUserObj(PoolUserData?.getPoolUserData);
				} else console.log(PoolUserError);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [PoolUserLoading]);

	console.log({ chainId: chain?.id, pool: poolData?.address, user: address });

	console.log("poolUserObj", poolUserObj);

	return (
		<>
			<div
				className={`${styles.PoolDropdownModal} ${styles["PoolDropdownModal--open"]}`}
			>
				<div>
					<div className={styles.PoolDropdownModal__asset}>
						<div className={styles.pooled}>
							<img src={poolData?.tokens[0]?.logo} alt="" />
							<p>Pooled {poolData?.tokens[0]?.symbol}</p>
						</div>
						<p>
							{PoolUserLoading ? (
								<Spinner w={15} h={15} />
							) : poolUserObj?.liquiditySupplied ? (
								poolUserObj?.liquiditySupplied[0]?.liquidity
							) : (
								"-"
							)}
						</p>
					</div>
					<div className={styles.PoolDropdownModal__asset}>
						<div className={styles.pooled}>
							<img src={poolData?.tokens[1]?.logo} alt="" />
							<p>Pooled {poolData?.tokens[1]?.symbol}</p>
						</div>
						<p>
							{PoolUserLoading ? (
								<Spinner w={15} h={15} />
							) : poolUserObj?.liquiditySupplied ? (
								poolUserObj?.liquiditySupplied[1]?.liquidity
							) : (
								"-"
							)}
						</p>
					</div>
					<div className={styles.PoolDropdownModal__info}>
						<div className={styles["twoPart-info"]}>
							<span>Your poolshare</span>
							<span>
								{PoolUserLoading ? (
									<Spinner w={15} h={15} />
								) : (
									poolUserObj?.poolShare
								)}
							</span>
						</div>
						<div className={styles["twoPart-info"]}>
							<span>LP token received:</span>
							<span>-</span>
						</div>
						<div className={styles["twoPart-info"]}>
							<span>Annual percentage yield (APY)</span>
							<span>-</span>
						</div>
						<div className={`${styles["twoPart-info"]} ${styles.addrDiv}`}>
							<span>Pool address</span>
							<div
								className={styles["wallet-copy"]}
								onClick={() => {
									navigator.clipboard.writeText(poolData?.address);
									setCopied(true);
									setTimeout(() => {
										setCopied(false);
									}, 500);
								}}
							>
								{copied ? (
									<IoCheckmarkCircleSharp color="#4bb543" />
								) : (
									<IoCopy color="#8E8E93" />
								)}
								<span>{poolData?.address?.substring(0, 12) + "..."}</span>
							</div>
						</div>
						<div className={styles["check-stat"]}>
							<HiOutlineExternalLink />
							<span>Check stat</span>
						</div>
						<div className={styles.btnWrap}>
							<button onClick={() => setRemoveModalOpen(true)}>
								Remove liquidity
							</button>
							<button onClick={() => setAddModalOpen(true)}>
								<BsFillPlusCircleFill size={11} />
								Add liquidity instead
							</button>
						</div>
					</div>
				</div>
			</div>
			<MUIModal
				open={removeModalOpen}
				handleClose={() => setRemoveModalOpen(false)}
			>
				<RemoveLiquidityModal
					poolData={poolData}
					poolUserObj={poolUserObj}
					setRemoveModalOpen={setRemoveModalOpen}
					setModal1Open={setModal1Open}
					// setRemoveModalOpen={setRemoveModalOpen}
				/>
			</MUIModal>
		</>
	);
};

export const AddLiquidityModal = ({
	setAddModalOpen,
	setModal1Open,
}: {
	setAddModalOpen: Dispatch<SetStateAction<boolean>>;
	setModal1Open?: Dispatch<SetStateAction<boolean>>;
}) => {
	const [cryptoOptions, setCryptoOptions] = useState<any>([]);
	const [assetObj, setAssetObj] = useState({ address: "", symbol: "" });
	const [currentRate, setCurrentRate] = useState(0);
	const [assetAmount, setAssetAmount] = useState(0);
	const [triggerTrans1, setTriggerTrans1] = useState(false);
	const [triggerTrans2, setTriggerTrans2] = useState(false);

	const { chain } = useNetwork();
	const { address } = useAccount();

	const {
		loading: tokenLoading,
		error: tokenError,
		data: chainTokens,
	} = useQuery(GET_CHAIN_SUPPORTED_TOKENS, {
		pollInterval: 300000,
		variables: { chainId: chain?.id },
	});

	const {
		loading: rateLoading,
		error: rateError,
		data: rateData,
	} = useQuery(GET_AGGREGATE_RATE, {
		pollInterval: 300000,
		variables: { chainId: chain?.id, tokenAddress: assetObj.address },
	});

	// add liquidity queries
	const [
		getQuote,
		{ loading: quoteLoading, error: quoteError, data: quoteData },
	] = useLazyQuery(GET_ADD_LIQUIDITY_QUOTE, {
		variables: {
			user: address,
			token: assetObj.address,
			amount: assetAmount,
			slippage: 0.1,
			chainId: chain?.id,
		},
		fetchPolicy: "no-cache",
	});

	const { __typename, ...rest } = quoteData?.getAddLiquidityQuote || {
		__typename: "",
		nil: "",
	};

	const [
		getAddLiquidityTx,
		{
			loading: addLiquidityTxLoading,
			error: addLiquidityTxError,
			data: addLiquidityTxData,
		},
	] = useLazyQuery(GET_ADD_LIQUIDITY_QUOTE_TX, {
		variables: { addLiquidityQuote: rest, chainId: chain?.id },
		fetchPolicy: "no-cache",
	});

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!tokenError && !tokenLoading)
					setCryptoOptions([
						...chainTokens?.getChainSupportedTokens?.map(
							(item: any, ind: number) => ({
								value: { address: item?.address, symbol: item?.symbol },
								label: (
									<div className={styles.cryptoOption} key={ind}>
										<img src={item?.logo} /> {item?.symbol}
									</div>
								),
							})
						),
					]);
				else console.log(tokenError);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [tokenLoading]);

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!rateError && !rateLoading)
					setCurrentRate(rateData?.getAggregateRate);
				else console.log(rateError);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [rateLoading]);

	useEffect(() => {
		// 2. this triggers the GET_SWAP_TO_WNGN_TX query as soon as the GET_SWAP_TO_WNGN_QUOTE query is successful
		const fetchFunc = async () => {
			try {
				if (!quoteError && !quoteLoading) {
					console.log(quoteData);
					console.log(quoteData?.getAddLiquidityQuote);
					getAddLiquidityTx();
				} else {
					console.log(quoteError);
					console.log(quoteError?.graphQLErrors);
					toast.error(quoteError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [quoteLoading]);

	useEffect(() => {
		// 3. this turns on triggerTrans1 as soon as the GET_SWAP_TO_WNGN_TX query is successful
		const fetchFunc = async () => {
			try {
				if (!addLiquidityTxError && !addLiquidityTxLoading) {
					console.log("addLiquidityTxData", addLiquidityTxData);
					if (addLiquidityTxData) {
						setTimeout(() => {
							setTriggerTrans1(true);
						}, 1000);
					}
				} else {
					console.log(addLiquidityTxError);
					console.log(addLiquidityTxError?.graphQLErrors);
					toast.error(addLiquidityTxError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [addLiquidityTxLoading]);

	// run transaction 1

	const { config: config1 } = usePrepareSendTransaction({
		request: {
			from: addLiquidityTxData?.getAddLiquidityTx[0]?.from,
			to: addLiquidityTxData?.getAddLiquidityTx[0]?.to,
			data: addLiquidityTxData?.getAddLiquidityTx[0]?.data,
			gasLimit: 3e7,
		},
		chainId: chain?.id,
		onError(err) {
			console.log("catchErr", err);
		},
	});

	const { data: transData1, sendTransaction: sendTransaction1 } =
		useSendTransaction({
			...config1,
			onError(err) {
				console.log("catchErr", err);
			},
			onSettled(data, error) {
				// 5. this turns off triggerTrans1 as soon as this (first) transaction is settled.
				setTriggerTrans1(false);
				console.log("Settled", { data, error });
			},
		});

	const {
		isLoading: trans1Loading,
		isSuccess: trans1Success,
		isError: isError1,
	} = useWaitForTransaction({
		// this waits for the first transaction
		hash: transData1?.hash,
		onSettled() {
			setTriggerTrans1(false);
		},
		onError(err) {
			console.log("catchErr", err);
		},
		onSuccess() {
			// 6. this turns on triggerTras2 as soon as this (first) transaction is confirmed successful
			setTriggerTrans2(true);
		},
	});

	useEffect(() => {
		// 4. this calls sendTransaction for the first transaction, as soon as triggerTrans1 is turned on

		console.log("config1", config1);
		console.log("triggerTrans1", triggerTrans1);
		setTimeout(() => {
			if (triggerTrans1) sendTransaction1?.();
		}, 500);
	}, [triggerTrans1]);

	useEffect(() => {
		console.log("trans1Loading", trans1Loading);
		console.log("trans1Success", trans1Success);
		console.log("isError1", isError1);

		if (trans1Success || isError1) setTriggerTrans1(false);
	}, [trans1Loading]);

	// run transaction 2
	const { config: config2 } = usePrepareSendTransaction({
		request: {
			from: addLiquidityTxData?.getAddLiquidityTx[1]?.from,
			to: addLiquidityTxData?.getAddLiquidityTx[1]?.to,
			data: addLiquidityTxData?.getAddLiquidityTx[1]?.data,
			gasLimit: 3e7,
		},
		chainId: chain?.id,
		onError(err) {
			console.log("catchErr", err);
		},
	});

	const { data: transData2, sendTransaction: sendTransaction2 } =
		useSendTransaction({
			...config2,
			onError(err) {
				console.log("catchErr", err);
			},
			onSettled(data, error) {
				// setTriggerTrans2(false);
				console.log("Settled", { data, error });
			},
		});

	const {
		isLoading: trans2Loading,
		isSuccess: trans2Success,
		isError: isError2,
	} = useWaitForTransaction({
		hash: transData2?.hash,
		onSettled() {
			// setTriggerTrans2(false);
			// toast.success("Transaction successful. Check your account.");
		},
		onError(err) {
			console.log("catchErr", err);
		},
	});

	useEffect(() => {
		// 7. this calls sendTransaction for the second transaction, as soon as triggerTrans2 is turned on
		console.log("config2", config2);
		if (triggerTrans2) sendTransaction2?.();
	}, [triggerTrans2]);

	useEffect(() => {
		// 8. This presents the success message and turns off triggerTrans2. Congrats! You're done!!
		if (trans2Success) {
			toast.success("Transaction successful. Check your account.");
			setTriggerTrans2(false);

			//close modals
			setAddModalOpen(false);
			setModal1Open && setModal1Open(false);
		}
		if (isError1) {
			setTriggerTrans2(false);
		}
	}, [trans2Success]);

	return (
		<div className={styles.AddLiquidityModal}>
			<div className={styles.AddLiquidityModal__top}>
				<div className={styles.token_tags}>
					<p className={styles.token}>Token:</p>
					<div className={styles.tags}>
						<span>75%</span>
						<span>50%</span>
						<span>25%</span>
						<span className={styles.max}>max</span>
					</div>
				</div>
				<div className={styles.select_token}>
					<div>
						<AssetSelect
							options={cryptoOptions}
							onChange={(e: any) => {
								setAssetObj(e.value);
							}}
							defaultValue={cryptoOptions[0]}
						/>
						<input
							type="text"
							name=""
							id=""
							placeholder="1.0"
							className={styles.input}
							value={assetAmount}
							onChange={(e) => {
								setAssetAmount(Number(e.target.value));
							}}
							// onInput={(e) => {
							// 	if (
							// 		e.currentTarget.value.includes(".") &&
							// 		!new RegExp(/^[0-9]*[.]{0,1}[0-9]*$/).test(
							// 			e.currentTarget.value
							// 		)
							// 	)
							// 		e.currentTarget.value = e.currentTarget.value.replace(
							// 			/[.]/,
							// 			""
							// 		);
							// }}
							// onKeyPress={(e) => {
							// 	const charCode = e.charCode || e.which;
							// 	const keyValue = String.fromCharCode(charCode);
							// 	const isValid = new RegExp(/[0-9.]/g).test(keyValue);
							// 	if (!isValid) {
							// 		e.preventDefault();
							// 		return;
							// 	}
							// }}
						/>
					</div>
					<div>
						<span>Balance:</span>
						<span>$0</span>
					</div>
				</div>
			</div>
			<div className={styles.AddLiquidityModal__middle}>
				<div className={styles.black_bar}>
					<RiErrorWarningLine />
					<div>
						<span>
							1 {assetObj.symbol} ={" "}
							{rateLoading ? (
								<Spinner w={10} h={10} color="#ffffff" />
							) : (
								currentRate
							)}{" "}
							WNGN
						</span>
						<span>|</span>
						<span>
							1 WNGN ={" "}
							{rateLoading ? (
								<Spinner w={10} h={10} color="#ffffff" />
							) : (
								(1 / currentRate).toFixed(10)
							)}{" "}
							{assetObj.symbol}
						</span>
					</div>
				</div>
				<div>
					<p>
						50% of the liquidity supplied will be converted to{" "}
						<span style={{ color: "#fff" }}>WNGN</span>
					</p>
				</div>
			</div>
			<div className={styles.AddLiquidityModal__btn}>
				<Button
					variant="primary"
					onClick={() => {
						if (address && assetObj?.address && assetAmount) getQuote();
					}}
					loading={
						quoteLoading ||
						addLiquidityTxLoading ||
						trans1Loading ||
						trans2Loading
					}
				>
					Add liquidity
				</Button>
			</div>
		</div>
	);
};

export const RemoveLiquidityModal = ({
	poolData,
	poolUserObj,
	setRemoveModalOpen,
	setModal1Open,
}: {
	poolData: any;
	poolUserObj: any;
	setRemoveModalOpen: Dispatch<SetStateAction<boolean>>;
	setModal1Open?: Dispatch<SetStateAction<boolean>>;
}) => {
	const [liquidityPercent, setLiquidityPercent] = useState(50);
	const [triggerTrans1, setTriggerTrans1] = useState(false);
	const [triggerTrans2, setTriggerTrans2] = useState(false);

	console.log("poolData", poolData);

	const { chain } = useNetwork();
	const { address } = useAccount();

	const {
		loading: tokenLoading,
		error: tokenError,
		data: chainTokens,
	} = useQuery(GET_CHAIN_SUPPORTED_TOKENS, {
		pollInterval: 300000,
		variables: { chainId: chain?.id },
	});

	const {
		loading: rateLoading,
		error: rateError,
		data: rateData,
	} = useQuery(GET_AGGREGATE_RATE, {
		pollInterval: 300000,
		variables: {
			chainId: chain?.id,
			tokenAddress: poolData?.tokens[0]?.address,
		},
	});

	// add liquidity queries
	const [
		getQuote,
		{ loading: quoteLoading, error: quoteError, data: quoteData },
	] = useLazyQuery(GET_REMOVE_LIQUIDITY_QUOTE, {
		variables: {
			user: address,
			pool: poolData?.address,
			liquidity:
				(liquidityPercent * poolUserObj?.liquiditySupplied[0]?.liquidity) / 100,
			chainId: chain?.id,
		},
		fetchPolicy: "no-cache",
	});

	const { __typename, ...rest } = quoteData?.getRemoveLiquidityQuote || {
		__typename: "",
		nil: "",
	};

	const [
		getRemoveLiquidityTx,
		{
			loading: removeLiquidityTxLoading,
			error: removeLiquidityTxError,
			data: removeLiquidityTxData,
		},
	] = useLazyQuery(GET_REMOVE_LIQUIDITY_QUOTE_TX, {
		variables: { removeLiquidityQuote: rest, chainId: chain?.id },
		fetchPolicy: "no-cache",
	});

	// useEffect(() => {
	// 	const fetchFunc = async () => {
	// 		try {
	// 			if (!tokenError && !tokenLoading)
	// 				setCryptoOptions([
	// 					...chainTokens?.getChainSupportedTokens?.map(
	// 						(item: any, ind: number) => ({
	// 							value: { address: item?.address, symbol: item?.symbol },
	// 							label: (
	// 								<div className={styles.cryptoOption} key={ind}>
	// 									<img src={item?.logo} /> {item?.symbol}
	// 								</div>
	// 							),
	// 						})
	// 					),
	// 				]);
	// 			else console.log(tokenError);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};

	// 	fetchFunc();
	// }, [tokenLoading]);

	// useEffect(() => {
	// 	const fetchFunc = async () => {
	// 		try {
	// 			if (!rateError && !rateLoading)
	// 				setCurrentRate(rateData?.getAggregateRate);
	// 			else console.log(rateError);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};

	// 	fetchFunc();
	// }, [rateLoading]);

	useEffect(() => {
		// 2. this triggers the GET_SWAP_TO_WNGN_TX query as soon as the GET_SWAP_TO_WNGN_QUOTE query is successful
		const fetchFunc = async () => {
			try {
				if (!quoteError && !quoteLoading) {
					console.log(quoteData);
					console.log(quoteData?.getRemoveLiquidityQuote);
					getRemoveLiquidityTx();
				} else {
					console.log(quoteError);
					console.log(quoteError?.graphQLErrors);
					toast.error(quoteError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [quoteLoading]);

	useEffect(() => {
		// 3. this turns on triggerTrans1 as soon as the GET_SWAP_TO_WNGN_TX query is successful
		const fetchFunc = async () => {
			try {
				if (!removeLiquidityTxError && !removeLiquidityTxLoading) {
					console.log("removeLiquidityTxData", removeLiquidityTxData);
					if (removeLiquidityTxData) {
						setTimeout(() => {
							setTriggerTrans1(true);
						}, 1000);
					}
				} else {
					console.log(removeLiquidityTxError);
					console.log(removeLiquidityTxError?.graphQLErrors);
					toast.error(removeLiquidityTxError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [removeLiquidityTxLoading]);

	// run transaction 1

	const { config: config1 } = usePrepareSendTransaction({
		request: {
			from: removeLiquidityTxData?.getRemoveLiquidityTx[0]?.from,
			to: removeLiquidityTxData?.getRemoveLiquidityTx[0]?.to,
			data: removeLiquidityTxData?.getRemoveLiquidityTx[0]?.data,
			gasLimit: 3e7,
		},
		chainId: chain?.id,
		onError(err) {
			console.log("catchErr", err);
		},
	});

	const { data: transData1, sendTransaction: sendTransaction1 } =
		useSendTransaction({
			...config1,
			onError(err) {
				console.log("catchErr", err);
			},
			onSettled(data, error) {
				// 5. this turns off triggerTrans1 as soon as this (first) transaction is settled.
				setTriggerTrans1(false);
				console.log("Settled", { data, error });
			},
		});

	const {
		isLoading: trans1Loading,
		isSuccess: trans1Success,
		isError: isError1,
	} = useWaitForTransaction({
		// this waits for the first transaction
		hash: transData1?.hash,
		onSettled() {
			setTriggerTrans1(false);
		},
		onError(err) {
			console.log("catchErr", err);
		},
		onSuccess() {
			// 6. this turns on triggerTras2 as soon as this (first) transaction is confirmed successful
			setTriggerTrans2(true);
		},
	});

	useEffect(() => {
		// 4. this calls sendTransaction for the first transaction, as soon as triggerTrans1 is turned on

		console.log("config1", config1);
		console.log("triggerTrans1", triggerTrans1);
		setTimeout(() => {
			if (triggerTrans1) sendTransaction1?.();
		}, 500);
	}, [triggerTrans1]);

	useEffect(() => {
		console.log("trans1Loading", trans1Loading);
		console.log("trans1Success", trans1Success);
		console.log("isError1", isError1);

		if (trans1Success || isError1) setTriggerTrans1(false);
	}, [trans1Loading]);

	// run transaction 2
	const { config: config2 } = usePrepareSendTransaction({
		request: {
			from: removeLiquidityTxData?.getRemoveLiquidityTx[1]?.from,
			to: removeLiquidityTxData?.getRemoveLiquidityTx[1]?.to,
			data: removeLiquidityTxData?.getRemoveLiquidityTx[1]?.data,
			gasLimit: 3e7,
		},
		chainId: chain?.id,
		onError(err) {
			console.log("catchErr", err);
		},
	});

	const { data: transData2, sendTransaction: sendTransaction2 } =
		useSendTransaction({
			...config2,
			onError(err) {
				console.log("catchErr", err);
			},
			onSettled(data, error) {
				// setTriggerTrans2(false);
				console.log("Settled", { data, error });
			},
		});

	const {
		isLoading: trans2Loading,
		isSuccess: trans2Success,
		isError: isError2,
	} = useWaitForTransaction({
		hash: transData2?.hash,
		onSettled() {
			// setTriggerTrans2(false);
			// toast.success("Transaction successful. Check your account.");
		},
		onError(err) {
			console.log("catchErr", err);
		},
	});

	useEffect(() => {
		// 7. this calls sendTransaction for the second transaction, as soon as triggerTrans2 is turned on
		console.log("config2", config2);
		if (triggerTrans2) sendTransaction2?.();
	}, [triggerTrans2]);

	useEffect(() => {
		// 8. This presents the success message and turns off triggerTrans2. Congrats! You're done!!
		if (trans2Success) {
			toast.success("Transaction successful. Check your account.");
			setTriggerTrans2(false);

			//close modals
			setRemoveModalOpen(false);
			setModal1Open && setModal1Open(false);
		}
		if (isError1) {
			setTriggerTrans2(false);
		}
	}, [trans2Success]);

	return (
		<div className={styles.RemoveLiquidityModal}>
			<div className={styles.RemoveLiquidityModal__top}>
				<p className={styles.title}>
					Remove {poolData?.tokens[0]?.symbol}-{poolData?.tokens[1]?.symbol}{" "}
					liquidity
				</p>
				<p>You will receive your token equivalent</p>
			</div>
			<div className={styles.RemoveLiquidityModal__outlineBox}>
				<div className={styles.percent_amount}>
					<p className={styles.percent}>{liquidityPercent}%</p>
					<p>Amount</p>
				</div>
				<div className={styles.slideDiv}>
					<MUISlider
						value={liquidityPercent}
						onChange={(e) => setLiquidityPercent(e?.target?.value)}
					/>
				</div>
				<div className={styles.tags}>
					<span
						className={`${styles.tag} ${
							styles[`tag--${liquidityPercent === 25 && "active"}`]
						}`}
						onClick={() => setLiquidityPercent(25)}
					>
						25%
					</span>
					<span
						className={`${styles.tag} ${
							styles[`tag--${liquidityPercent === 50 && "active"}`]
						}`}
						onClick={() => setLiquidityPercent(50)}
					>
						50%
					</span>
					<span
						className={`${styles.tag} ${
							styles[`tag--${liquidityPercent === 75 && "active"}`]
						}`}
						onClick={() => setLiquidityPercent(75)}
					>
						75%
					</span>
					<span
						className={`${styles.tag} ${
							styles[`tag--${liquidityPercent === 100 && "active"}`]
						}`}
						onClick={() => setLiquidityPercent(100)}
					>
						Max
					</span>
				</div>
			</div>
			<div>
				<p className={styles.subTitle}>You will receive</p>
				<div className={styles.RemoveLiquidityModal__fillBox}>
					<div>
						<p className={styles.assett}>
							<img src={poolData?.tokens[0]?.logo} alt="" />
							<span>{poolData?.tokens[0]?.symbol}</span>
						</p>
						<span>{poolData?.tokens[0]?.liquidity}</span>
					</div>
					<div>
						<p className={styles.assett}>
							<img src={poolData?.tokens[1]?.logo} alt="" />
							<span>{poolData?.tokens[1]?.symbol}</span>
						</p>
						<span>{poolData?.tokens[1]?.liquidity}</span>
					</div>
				</div>
			</div>
			<div className={styles.RemoveLiquidityModal__btn}>
				<Button
					variant="primary"
					onClick={() => {
						getQuote();
					}}
					loading={
						quoteLoading ||
						removeLiquidityTxLoading ||
						trans1Loading ||
						trans2Loading
					}
				>
					Remove liquidity
				</Button>
			</div>
		</div>
	);
};
