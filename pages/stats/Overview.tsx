import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";
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

Overview.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
