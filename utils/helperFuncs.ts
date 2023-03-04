import { Dispatch, SetStateAction } from "react";
import { useQuery } from "@apollo/client";
import { apolloClient } from "@/pages/_app";
import { GET_AGGREGATE_RATE } from "../graphql/queries";

const fetchAggrRate = async (
	tokenAddress: string,
	chainId: Number,
	ind: Number
) => {
	try {
		const res = await apolloClient.query({
			query: GET_AGGREGATE_RATE,
			variables: { tokenAddress: tokenAddress, chainId: chainId },
		});
		console.log(ind, res);
		return res?.data?.getAggregateRate;
	} catch (e) {
		console.log(e);
	}
};

export const morphSupportedAssets = async (
	APIArray: any[],
	screenSize: "web" | "mob" = "web"
) => {
	console.log("APIArray", screenSize, APIArray);
	let dollPrice = 0;

	const resultArr = await Promise.all(
		APIArray.map(async (item, ind) => {
			try {
				const nairaPrice: number = await fetchAggrRate(
					item?.tokenAddress,
					item?.chainId,
					ind
				);

				console.log("nairaPrice", nairaPrice, item);
				if (item?.symbol === "usdt") dollPrice = nairaPrice;

				return {
					name: [item?.image, item?.name],
					price: `₦${nairaPrice?.toFixed(2)}`,
					price_change: [
						item?.price_change_percentage_24h?.toFixed(2),
						`https://nomics.com/images/sparkline/assets/${
							item?.symbol
						}-USD-1d.svg?p=${new Date().getTime()}&width=256`,
					],
					...(screenSize === "web" ? { vol_24: "₦ -" } : {}),
					tvl: `₦${Intl.NumberFormat("en-US", {
						notation: "compact",
						maximumFractionDigits: 1,
					}).format(item?.total_volume * dollPrice)}`,
				};
			} catch (e) {
				console.log(e);
			}
		})
	);

	console.log("resultArr", resultArr);
	return resultArr;
};

export const toggleSideDrawer =
	(open: boolean, setOpen: Dispatch<SetStateAction<boolean>>) =>
	(event: any) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setOpen(open);
	};
