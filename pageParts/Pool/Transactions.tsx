import Table from "../../components/Table";
import Tabs from "../../components/Tabs";
import styles from "./styles.module.scss";

export const Transactions = () => {
	const headers = [
		{ label: "Type", key: "type", type: "imgText" },
		{ label: "Total value", key: "total_value", type: "default" },
		{ label: "Token amount", key: "token_amount", type: "default" },
		{ label: "Token amount", key: "token_amount2", type: "default" },
		{ label: "Account", key: "account", type: "wallet" },
		{ label: "Time", key: "time", type: "default" },
	];
	const mobileHeaders = [
		{ label: "Type", key: "type", type: "imgText" },
		{ label: "Total value", key: "total_value", type: "default" },
		{ label: "Account", key: "account", type: "wallet" },
		{ label: "Time", key: "time", type: "default" },
	];

	const data = Array(10)
		.fill(0)
		.map((item) => ({
			type: [
				`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
				`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png`,
				"Swap ETH for DOGE",
			],
			total_value: "$249.506",
			token_amount: "36.41k ETH",
			token_amount2: "12.53 WNGN",
			account: "0x22a...w2e",
			time: "3 days ago",
		}));
	const mobileData = Array(10)
		.fill(0)
		.map((item) => ({
			type: [
				`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
				`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/doge.png`,
				"Swap ETH for DOGE",
			],
			total_value: "$249.506",
			account: "0x22a...w2e",
			time: "3 days ago",
		}));

	return (
		<section className={styles.Transactions}>
			<div>
				<h4>Transactions</h4>
				<Tabs tabItems={["All", "Sell", "Buy"]} />
				<div className={styles.tables}>
					<Table headers={headers} data={data} />
					<Table headers={mobileHeaders} data={mobileData} />
				</div>
			</div>
		</section>
	);
};
