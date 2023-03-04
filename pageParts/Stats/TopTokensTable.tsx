import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import Table from "../../components/Table";
import wngn from "../../assets/images/wngn.svg";
import { getExchangeList } from "../../requests";
import { useQuery } from "@apollo/client";
import { GET_SUPPORTED_TOKENS } from "../../graphql/queries";
import { morphSupportedAssets } from "../../utils/helperFuncs";

export const TopTokensTable = () => {
	const {
		loading,
		error,
		data: supportedTokenData,
	} = useQuery(GET_SUPPORTED_TOKENS, { pollInterval: 300000 });

	const [supportedTokensWeb, setSupportedTokensWeb] = useState<any[]>([]);
	const [supportedTokensMobile, setSupportedTokensMobile] = useState<any[]>([]);
	const [axiosLoading, setAxiosLoading] = useState(false);

	const headers = [
		{ label: "Name", key: "name", type: "imgText" },
		{ label: "Price", key: "price", type: "default" },
		{ label: "Price change", key: "price_change", type: "chart" },
		{ label: "Volume 24hr", key: "vol_24", type: "default" },
		{ label: "TVL", key: "tvl", type: "default" },
	];
	const mobileHeaders = [
		{ label: "Name", key: "name", type: "imgText" },
		{ label: "Price", key: "price", type: "default" },
		{ label: "Price change", key: "price_change", type: "chart" },
		// { label: "Volume 24hr", key: "vol_24", type: "default" },
		{ label: "TVL", key: "tvl", type: "default" },
	];

	const data = [
		Array(10)
			.fill(0)
			.map((item) => ({
				name: [
					`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
					"Ethereum",
				],
				price: "$0.567",
				price_change: [
					"1.62%",
					"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3408.svg",
				],
				vol_24: "$456.91k",
				tvl: "$24.32m",
			})),
		Array(7)
			.fill(0)
			.map((item) => ({
				name: [
					`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png`,
					"Doge",
				],
				price: "$0.567",
				price_change: [
					"1.62%",
					"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3408.svg",
				],
				vol_24: "$456.91k",
				tvl: "$24.32m",
			})),
	].flat();

	const mobileData = [
		Array(10)
			.fill(0)
			.map((item) => ({
				name: [
					`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
					"Ethereum",
				],
				price: "$0.567",
				price_change: [
					"1.62%",
					"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3408.svg",
				],
				// vol_24: "$456.91k",
				tvl: "$24.32m",
			})),
		Array(7)
			.fill(0)
			.map((item) => ({
				name: [
					`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png`,
					"Doge",
				],
				price: "$0.567",
				price_change: [
					"1.62%",
					"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3408.svg",
				],
				// vol_24: "$456.91k",
				tvl: "$24.32m",
			})),
	].flat();

	console.log(supportedTokenData);

	useEffect(() => {
		const fetchFunc = async () => {
			setAxiosLoading(true);
			try {
				const res = await getExchangeList();
				console.log(res);
				if (!error) {
					setSupportedTokensWeb([
						...(await morphSupportedAssets(
							res?.data
								?.filter((item: any) =>
									supportedTokenData?.getSupportedTokens
										?.map((jujuItem: any) => jujuItem?.symbol?.toLowerCase())
										.includes(item?.symbol?.toLowerCase())
								)
								.map((item: any) => {
									const jujuItem =
										supportedTokenData?.getSupportedTokens?.filter(
											(ii: any) => ii?.symbol?.toLowerCase() === item?.symbol
										);
									return {
										...item,
										tokenAddress: jujuItem[0]?.address,
										chainId: jujuItem[0]?.chain?.id,
									};
								}),
							"web"
						)),
						,
						{
							name: [wngn, "Wrapped Naira"],
							price: `₦1`,
							price_change: [0, `-`],
							vol_24: "₦ -",
							tvl: `₦ -`,
							tokenAddress: "0xc7EAC09CB2410a7D7bafBbe7b377833dda8DeAa7",
							chainId: "42161",
						},
					]);
					setSupportedTokensMobile([
						...(await morphSupportedAssets(
							res?.data
								?.filter((item: any) =>
									supportedTokenData?.getSupportedTokens
										?.map((jujuItem: any) => jujuItem?.symbol?.toLowerCase())
										.includes(item?.symbol?.toLowerCase())
								)
								.map((item: any) => {
									const jujuItem =
										supportedTokenData?.getSupportedTokens?.filter(
											(ii: any) => ii?.symbol?.toLowerCase() === item?.symbol
										);
									return {
										...item,
										tokenAddress: jujuItem[0]?.address,
										chainId: jujuItem[0]?.chain?.id,
									};
								}),
							"mob"
						)),
						{
							name: [wngn, "Wrapped Naira"],
							price: `₦1`,
							price_change: [0, `-`],
							tvl: `₦ -`,
							tokenAddress: "0xc7EAC09CB2410a7D7bafBbe7b377833dda8DeAa7",
							chainId: "42161",
						},
					]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setAxiosLoading(false);
			}
		};

		fetchFunc();
	}, [supportedTokenData]);

	return (
		<section className={styles.TopTokensTable}>
			<div>
				<h4>Top tokens</h4>
				<div className={styles.TopPoolsTable__tables}>
					<Table
						headers={headers}
						data={supportedTokensWeb}
						loading={loading || axiosLoading}
					/>
					<Table
						headers={mobileHeaders}
						data={supportedTokensMobile}
						loading={loading || axiosLoading}
					/>
				</div>
			</div>
		</section>
	);
};
