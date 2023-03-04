import {
	OverviewCharts,
	TopPoolsTable,
	TopTokensTable,
	TopChartBit,
} from "../../pageParts/Stats";

const Pool = () => {
	return (
		<main>
			<TopChartBit />
			<TopTokensTable />
		</main>
	);
};

export default Pool;
