import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";
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

Pool.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
