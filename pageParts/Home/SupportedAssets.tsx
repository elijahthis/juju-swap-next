import styles from "./styles.module.scss";
import Table from "../../components/Table";
import { useEffect, useState } from "react";
import { getExchangeList } from "../../requests";
import { morphSupportedAssets } from "../../utils/helperFuncs";
import { useJujuStore } from "../../zustand/store";
import { useQuery } from "@apollo/client";
import { GET_JUJU_STATS } from "../../graphql/queries";
import wngn from "../../assets/images/wngn.svg";

export const SupportedAssets = () => {
	const marketData = useJujuStore((state: any) => state.marketData);
	const updateMarketData = useJujuStore((state: any) => state.updateMarketData);
	const [axiosLoading, setAxiosLoading] = useState(false);

	const {
		loading,
		error,
		data: jujuStats,
	} = useQuery(GET_JUJU_STATS, { pollInterval: 300000 });

	const [supportedAssetsWeb, setSupportedAssetsWeb] = useState<any[]>([]);
	const [supportedAssetsMobile, setSupportedAssetsMobile] = useState<any[]>([]);

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
		{ label: "TVL", key: "tvl", type: "default" },
	];

	const webData = [
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
					`https://nomics.com/images/sparkline/assets/ETH-USD-1d.svg?p=${new Date().getTime()}&width=256`,
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
					"https://nomics.com/images/sparkline/assets/BTC-USD-1d.svg?p=1673253300&width=256",
				],
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
				tvl: "$24.32m",
			})),
	].flat();

	useEffect(() => {
		const fetchFunc = async () => {
			setAxiosLoading(true);
			try {
				const res = await getExchangeList();
				console.log(res);
				if (!error) {
					setSupportedAssetsWeb([
						...(await morphSupportedAssets(
							res?.data
								?.filter((item: any) =>
									jujuStats?.getJujuStats?.supportedAssets
										?.map((jujuItem: any) => jujuItem?.symbol?.toLowerCase())
										.includes(item?.symbol?.toLowerCase())
								)
								.map((item: any) => {
									const jujuItem =
										jujuStats?.getJujuStats?.supportedAssets?.filter(
											(ii: any) => ii?.symbol?.toLowerCase() === item?.symbol
										);
									return {
										...item,
										tokenAddress: jujuItem[0]?.address,
										chainId: jujuItem[0]?.chainId,
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
					setSupportedAssetsMobile([
						...(await morphSupportedAssets(
							res?.data
								?.filter((item: any) =>
									jujuStats?.getJujuStats?.supportedAssets
										?.map((jujuItem: any) => jujuItem?.symbol?.toLowerCase())
										.includes(item?.symbol?.toLowerCase())
								)
								.map((item: any) => {
									const jujuItem =
										jujuStats?.getJujuStats?.supportedAssets?.filter(
											(ii: any) => ii?.symbol?.toLowerCase() === item?.symbol
										);
									return {
										...item,
										tokenAddress: jujuItem[0]?.address,
										chainId: jujuItem[0]?.chainId,
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
	}, [jujuStats]);

	console.log("marketData", marketData);
	console.log("supportedAssetsWeb", supportedAssetsWeb);

	return (
		<section className={`${styles.HomePageSection} ${styles.SupportedAssets}`}>
			<div>
				<h1>Supported Assets</h1>
				<p>supported assets that can be swapped for Naira</p>
				<div>
					<Table
						headers={headers}
						data={supportedAssetsWeb}
						loading={loading || axiosLoading}
					/>
					<Table
						headers={mobileHeaders}
						data={supportedAssetsMobile}
						loading={loading || axiosLoading}
					/>
				</div>
			</div>
		</section>
	);
};
