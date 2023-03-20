import { useState, useEffect } from "react";
import BlackCard from "../../components/BlackCard";
import SideSlider from "../../components/SideSlider";
import styles from "./styles.module.scss";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Button from "../../components/Button";
import WalletDropdown from "../../components/WalletDropdown";
import { RiErrorWarningLine } from "react-icons/ri";
import { PriceInfo } from "../../components/PriceInfo";
import AssetSelect from "../../components/AssetSelect";
import {
	useAccount,
	useNetwork,
	usePrepareSendTransaction,
	useSendTransaction,
	useWaitForTransaction,
} from "wagmi";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
	GET_CHAIN_SUPPORTED_TOKENS,
	GET_AGGREGATE_RATE,
	GET_SWAP_TO_WNGN_QUOTE,
	GET_SWAP_TO_WNGN_TX,
	GET_REDEEM_QUOTE,
	GET_REDEEM_TX,
} from "../../graphql/queries";
import { TRANSFER_FIAT } from "../../graphql/mutations";
import wngn from "../../assets/images/wngn.svg";
import { getBankList, getAccountName } from "../../requests";
import { useJujuStore } from "../../zustand/store";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import SpinnerComponent from "@/components/SpinnerComponent";

export const ExchangeCard = () => {
	/* 
		The logic is all over the place, as a result of the weird ass nature of these wagmi hooks. 
		My apologies in advance. 
		For the important steps, I tried to add numbers at the beginning to help you understand 
		the flow in chronological order.
		Numbers 1 - 7. And beyond, if need be.

		Also take note that the GraphQL queries for WNGN swap and its TX are different from the rest.  
	*/

	const marketData = useJujuStore((state: any) => state.marketData);
	const userData = useJujuStore((state: any) => state.userData);
	const userLoading = useJujuStore((state: any) => state.userLoading);

	const [currentTab, setCurrentTab] = useState(0);

	const [assetObj, setAssetObj] = useState({ address: "", symbol: "" });
	const [cryptoOptions, setCryptoOptions] = useState<any>([]);
	const [bankOptions, setBankOptions] = useState<any>([]);
	const [accountOptions, setAccountOptions] = useState<any>([]);
	const [currentRate, setCurrentRate] = useState(0);
	const [assetAmount, setAssetAmount] = useState(0);
	const [nairaAmount, setNairaAmount] = useState(0);
	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [bankObj, setBankObj] = useState({ name: "", code: "", logo: "" });
	const [accountNameLoading, setAccountNameLoading] = useState(false);
	const [triggerTrans1, setTriggerTrans1] = useState(false);
	const [triggerTrans2, setTriggerTrans2] = useState(false);
	const [isWNGN, setIsWNGN] = useState(false);
	const [reload, setReload] = useState(false);

	const { chain } = useNetwork();
	const { address } = useAccount();

	const debouncedAccountNumber = useDebounce(accountNumber, 1000);

	const {
		loading: tokenLoading,
		error: tokenError,
		data: chainTokens,
	} = useQuery(GET_CHAIN_SUPPORTED_TOKENS, {
		pollInterval: 300000,
		variables: { chainId: chain?.id },
	});

	console.log("chain?.id", chain?.id);
	console.log("chainTokens", chainTokens);

	const {
		loading: rateLoading,
		error: rateError,
		data: rateData,
	} = useQuery(GET_AGGREGATE_RATE, {
		pollInterval: 300000,
		variables: { chainId: chain?.id, tokenAddress: assetObj.address },
	});

	const [getSwap, { loading: swapLoading, error: swapError, data: swapData }] =
		useLazyQuery(GET_SWAP_TO_WNGN_QUOTE, {
			variables: {
				user: address,
				token: assetObj.address,
				amount: assetAmount,
				slippage: 0.1,
				chainId: chain?.id,
			},
			fetchPolicy: "no-cache",
		});

	// if (swapData?.getSwapToWNGNQuote)
	const { __typename, ...rest } = swapData?.getSwapToWNGNQuote || {
		__typename: "",
		nil: "",
	};

	const [
		getSwapTx,
		{ loading: swapTxLoading, error: swapTxError, data: swapTxData },
	] = useLazyQuery(GET_SWAP_TO_WNGN_TX, {
		variables: { swapToWngnQuote: rest, chainId: chain?.id },
		fetchPolicy: "no-cache",
	});

	// for wngn
	const [
		getRedeemQuote,
		{
			loading: redeemQuoteLoading,
			error: redeemQuoteError,
			data: redeemQuoteData,
		},
	] = useLazyQuery(GET_REDEEM_QUOTE, {
		variables: {
			user: address,
			amount: assetAmount,
			chainId: chain?.id,
		},
		fetchPolicy: "no-cache",
	});
	const { __typename: tt, ...restWNGN } = redeemQuoteData?.getRedeemQuote || {
		__typename: "",
		nil: "",
	};

	const [
		getRedeemTx,
		{ loading: redeemTxLoading, error: redeemTxError, data: redeemTxData },
	] = useLazyQuery(GET_REDEEM_TX, {
		variables: {
			redeemQuote: restWNGN,
			chainId: chain?.id,
		},
		fetchPolicy: "no-cache",
	});

	const fetchAccountName = async () => {
		setAccountNameLoading(true);
		try {
			const res = await getAccountName(debouncedAccountNumber, bankObj.code);
			console.log(res);
			setAccountName(res?.data?.data?.account_name);
		} catch (e) {
			console.log(e);
			toast.error((e as any)?.response?.data?.message);
			setAccountName("");
		} finally {
			setAccountNameLoading(false);
		}
	};

	const currencyOptions = [
		{
			value: "NG",
			label: (
				<div className={styles.cryptoOption}>
					<img
						src={`https://raw.githubusercontent.com/lipis/flag-icons/a108610f6372e5ba4c8a8f80cab39f88c676a742/flags/1x1/ng.svg`}
					/>{" "}
					Nigeria (NGN)
				</div>
			),
		},
	];

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!tokenError && !tokenLoading)
					setCryptoOptions([
						...chainTokens?.getChainSupportedTokens
							// ?.filter((item: any) => item?.symbol !== "WNGN")
							?.map((item: any) => ({
								value: { address: item?.address, symbol: item?.symbol },
								label: (
									<div className={styles.cryptoOption}>
										<img src={item?.logo} /> {item?.symbol}
									</div>
								),
							})),
						// {
						// 	value: "WNGN",
						// 	label: (
						// 		<div className="cryptoOption">
						// 			<img src={wngn} /> WNGN
						// 		</div>
						// 	),
						// },
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
				const res = await getBankList();
				console.log("getBankList", res);

				setBankOptions(
					res.data?.map((item: any) => ({
						value: item?.name,
						label: (
							<div className={styles.cryptoOption}>
								<img src={item?.logo} /> {item?.name}
							</div>
						),
						obj: { name: item?.name, code: item?.code, logo: item?.logo },
					}))
				);
			} catch (e) {
				console.log(e);
			}
		};

		fetchFunc();
	}, []);

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
		if (debouncedAccountNumber.length > 5 && bankObj.name) fetchAccountName();
		else {
			setAccountName("");
		}
	}, [debouncedAccountNumber, bankObj.code]);

	useEffect(() => {
		// 2. this triggers the GET_SWAP_TO_WNGN_TX query as soon as the GET_SWAP_TO_WNGN_QUOTE query is successful
		const fetchFunc = async () => {
			try {
				if (!swapError && !swapLoading) {
					console.log(swapData);
					console.log(swapData?.getSwapToWNGNQuote);
					getSwapTx();
				} else {
					console.log(swapError);
					toast.error(swapError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [swapLoading]);
	useEffect(() => {
		// ------ WNGN variant ------
		// 2. this triggers the GET_REDEEM_TX query as soon as the GET_REDEEM_QUOTE query is successful
		const fetchFunc = async () => {
			try {
				if (!redeemQuoteError && !redeemQuoteLoading) {
					console.log(redeemQuoteData);
					console.log(redeemQuoteData?.getRedeemQuote);
					getRedeemTx();
				} else {
					console.log(redeemQuoteError);
					toast.error(redeemQuoteError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [redeemQuoteLoading]);

	useEffect(() => {
		// 3. this turns on triggerTrans1 as soon as the GET_SWAP_TO_WNGN_TX query is successful
		const fetchFunc = async () => {
			try {
				if (!swapTxError && !swapTxLoading) {
					console.log("swapTxData", swapTxData);
					if (swapTxData) {
						setTimeout(() => {
							setTriggerTrans1(true);
						}, 1000);
					}
				} else {
					console.log(swapTxError);
					console.log(swapTxError?.graphQLErrors);
					toast.error(swapTxError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [swapTxLoading]);
	useEffect(() => {
		// ------ WNGN variant ------
		// 3. this turns on triggerTrans1 as soon as the GET_REDEEM_TX query is successful
		const fetchFunc = async () => {
			try {
				if (!redeemTxError && !redeemTxLoading) {
					console.log("redeemTxData", redeemTxData);
					if (redeemTxData) {
						setTimeout(() => {
							setTriggerTrans1(true);
						}, 1000);
					}
				} else {
					console.log(redeemTxError);
					console.log(redeemTxError?.graphQLErrors);
					toast.error(redeemTxError?.graphQLErrors[0].message);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [redeemTxLoading]);

	// run transaction 1

	const { config: config1 } = usePrepareSendTransaction({
		request: {
			from: isWNGN
				? redeemTxData?.getRedeemTx[0]?.from
				: swapTxData?.getSwapToWNGNTx[0]?.from,
			to: isWNGN
				? redeemTxData?.getRedeemTx[0]?.to
				: swapTxData?.getSwapToWNGNTx[0]?.to,
			data: isWNGN
				? redeemTxData?.getRedeemTx[0]?.data
				: swapTxData?.getSwapToWNGNTx[0]?.data,
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

		setTimeout(() => {
			if (triggerTrans1) sendTransaction1?.();
		}, 500);
	}, [triggerTrans1]);

	useEffect(() => {
		if (trans1Success || isError1) setTriggerTrans1(false);
	}, [trans1Loading]);

	// run transaction 2
	const { config: config2 } = usePrepareSendTransaction({
		request: {
			from: isWNGN
				? redeemTxData?.getRedeemTx[1]?.from
				: swapTxData?.getSwapToWNGNTx[1]?.from,
			to: isWNGN
				? redeemTxData?.getRedeemTx[1]?.to
				: swapTxData?.getSwapToWNGNTx[1]?.to,
			data: isWNGN
				? redeemTxData?.getRedeemTx[1]?.data
				: swapTxData?.getSwapToWNGNTx[1]?.data,
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
		}
		if (isError1) {
			setTriggerTrans2(false);
		}
	}, [trans2Success]);

	useEffect(() => {
		if (!userLoading && userData?.accountDetails) {
			setAccountOptions(
				userData?.accountDetails?.map((item: any) => ({
					value: item?.bank?.name,
					label: (
						<div className={styles.cryptoOption}>
							<img
								src={
									bankOptions?.filter(
										(bankObj: any) => bankObj?.obj?.code === item?.bank?.code
									)[0]?.obj?.logo
								}
							/>{" "}
							{item?.bank?.name} - {item?.accountNumber}
						</div>
					),
					obj: {
						accountNumber: item?.accountNumber,
						accountName: item?.accountName,
						bank: {
							name: item?.bank?.name,
							code: item?.bank?.code,
							logo: bankOptions?.filter(
								(bankObj: any) => bankObj?.obj?.code === item?.bank?.code
							)[0]?.obj?.logo,
						},
					},
				}))
			);
		}
	}, [userLoading]);

	console.log("accountName", accountName);

	return (
		<section className={styles.ExchangeCard}>
			<div>
				<BlackCard>
					<div className={styles.ExchangeCard__inner}>
						<SideSlider
							sideList={["Sell", "Buy"]}
							currentTab={currentTab}
							setCurrentTab={setCurrentTab}
						/>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								setTriggerTrans1(false);
								setTriggerTrans2(false);
								if (
									address &&
									assetObj.address &&
									assetAmount &&
									chain?.id &&
									accountName
								) {
									// 1. This kicks everythiong off, calling the first query (GET_SWAP_TO_WNGN_QUOTE) onSubmit. Everythig else is more or less automated after this.
									isWNGN ? getRedeemQuote() : getSwap();
								}
							}}
						>
							<div>
								<Label>
									<div className={styles["drop-Price"]}>
										<AssetSelect
											options={cryptoOptions}
											onChange={(e: any) => {
												console.log("e.value", e.value);
												setAssetObj(e.value);
												if (e.value?.symbol === "WNGN") setIsWNGN(true);
												else setIsWNGN(false);
											}}
											defaultValue={cryptoOptions[0]}
										/>
										<PriceInfo
											change={false}
											val={currentRate}
											priceChange={
												marketData?.filter(
													(item: any) =>
														item?.symbol?.toLowerCase() ===
														assetObj.symbol?.toLowerCase()
												)[0]?.price_change_percentage_24h
											}
											loading={rateLoading}
										/>
									</div>
								</Label>
								<Input
									max={true}
									type="number"
									value={assetAmount.toString()}
									onChange={(e) => {
										setAssetAmount(Number(e.target.value));

										if (!isNaN(Number(e.target.value)))
											setNairaAmount(Number(e.target.value) * currentRate);
									}}
									required={true}
								/>
							</div>
							<div>
								<Label>
									<AssetSelect
										options={currencyOptions}
										onChange={(e: any) => {
											// setAsset(e.value);
										}}
										defaultValue={currencyOptions[0]}
									/>
								</Label>
								<Input
									value={nairaAmount}
									max={true}
									type="number"
									onChange={(e: any) => {
										setNairaAmount(e.target.value);

										if (!isNaN(Number(e.target.value)))
											setAssetAmount(Number(e.target.value) / currentRate);
									}}
								/>
							</div>
							<div>
								<Label>
									<p
										style={{
											color: "#ffffff",
											fontSize: "16px",
											marginBottom: "0.5rem",
										}}
									>
										Select bank account
									</p>
									<AssetSelect
										options={accountOptions}
										value={{
											value: bankObj?.name,
											label: (
												<div className={styles.cryptoOption}>
													<img
														src={
															bankOptions?.filter(
																(item: any) => item?.obj?.code === bankObj?.code
															)[0]?.obj?.logo
														}
													/>{" "}
													{bankObj?.name} - {accountNumber}
												</div>
											),
											obj: {
												accountNumber: accountNumber,
												accountName: accountName,
												bank: {
													name: bankObj?.name,
													code: bankObj?.code,
												},
											},
										}}
										onChange={(e: any) => {
											console.log("weeee", e);

											setBankObj(e.obj.bank);
											// setReload(true);
											setTimeout(() => {
												setAccountNumber(e.obj.accountNumber);
												// setReload(false);
											}, 500);
										}}
										// defaultValue={accountOptions[0]}
									/>
								</Label>
							</div>
							{reload ? (
								<SpinnerComponent />
							) : (
								<div>
									<Label>
										<AssetSelect
											options={bankOptions}
											onChange={(e: any) => {
												setBankObj(e.obj);
											}}
											value={{
												value: bankObj.name,
												label: (
													<div className={styles.cryptoOption}>
														<img src={bankObj.logo} /> {bankObj.name}
													</div>
												),
												obj: {
													name: bankObj.name,
													code: bankObj.code,
													logo: bankObj.logo,
												},
											}}
										/>
									</Label>
									<Input
										value={accountNumber}
										sidePiece={accountName || "-"}
										onChange={(e) => setAccountNumber(e.target.value)}
										loading={accountNameLoading}
									/>
								</div>
							)}
							<div>
								{/* <WalletDropdown
									label="receipient address"
									selectedWallet="0xdaf5b8D1c9c1dA1311"
									setSelectedWallet={() => {}}
									list={["0x8984fglad456yre466", "0xdaf5b8D1c9c1dA1311"]}
								/> */}
							</div>
							<div className={styles.warning}>
								<RiErrorWarningLine />
								<p>Payment will be made once the transaction is confirmed.</p>
							</div>
							<Button
								variant="primary"
								type="submit"
								loading={
									swapLoading ||
									swapTxLoading ||
									trans1Loading ||
									trans2Loading ||
									redeemQuoteLoading ||
									redeemTxLoading
								}
							>
								Sell
							</Button>
						</form>
					</div>
				</BlackCard>
			</div>
		</section>
	);
};
