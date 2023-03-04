import styles from "./styles.module.scss";
import Table from "../../components/Table";
import wngn from "../../assets/images/wngn.svg";

export const TopPoolsTable = () => {
	const headers = [
		{ label: "Type", key: "type", type: "imgText" },
		{ label: "TVL", key: "tvl", type: "default" },
		{ label: "Volume 24hr", key: "vol_24", type: "default" },
		{ label: "Fees 24hr", key: "fees_24", type: "default" },
		{ label: "APY", key: "apy", type: "chart" },
	];
	const mobileHeaders = [
		{ label: "Type", key: "type", type: "imgText" },
		{ label: "TVL", key: "tvl", type: "default" },
		{ label: "Volume 24hr", key: "vol_24", type: "default" },
		{ label: "APY", key: "apy", type: "chart" },
	];

	const data = Array(10)
		.fill(0)
		.map((item) => ({
			type: [
				`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
				wngn,
				"ETH/WNGN",
			],
			tvl: "$249,506,506",
			vol_24: "36.41k ETH",
			fees_24: "36.41k ETH",
			apy: ["1.62%"],
		}));
	const mobileData = Array(10)
		.fill(0)
		.map((item) => ({
			type: [
				`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
				wngn,
				"ETH/WNGN",
			],
			tvl: "$249,506,506",
			vol_24: "36.41k ETH",
			apy: ["1.62%"],
		}));

	return (
		<section className={styles.TopPoolsTable}>
			<div>
				<h4>Top pools</h4>
				<div className={styles.TopPoolsTable__tables}>
					<Table headers={headers} data={data} />
					<Table headers={mobileHeaders} data={mobileData} />
				</div>
			</div>
		</section>
	);
};
