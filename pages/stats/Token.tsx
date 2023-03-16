import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";
import {
	OverviewCharts,
	TopPoolsTable,
	TopTokensTable,
} from "../../pageParts/Stats";

const Token = () => {
	return (
		<main>
			<TopTokensTable />
		</main>
	);
};

export default Token;

Token.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
