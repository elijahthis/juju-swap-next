import { ExchangeCard, Transactions } from "../pageParts/Exchange";
import { Footer } from "../components/Footer";
import Settings from "./settings";
import PageLayout from "@/layouts/PageLayout";
import { ReactNode } from "react";

const Exchange = () => {
	return (
		<main>
			<ExchangeCard />
			{/* <Transactions /> */}
			<Footer />
		</main>
	);
};

export default Exchange;

Exchange.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
