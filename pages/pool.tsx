import { PoolCard, Transactions } from "../pageParts/Pool";
import { Footer } from "../components/Footer";
import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";

const Pool = () => {
	return (
		<main>
			<PoolCard />
			{/* <Transactions /> */}
			<Footer />
		</main>
	);
};

export default Pool;

Pool.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
