import {
	OverviewCharts,
	TopPoolsTable,
	TopTokensTable,
} from "../../pageParts/Stats";

const Overview = () => {
	return (
		<main>
			<OverviewCharts />
			<TopPoolsTable />
			<TopTokensTable />
		</main>
	);
};

export default Overview;
