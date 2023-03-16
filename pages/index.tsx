import {
	Hero,
	SupportedBlockchains,
	ExchangeYour,
	SupportedAssets,
	HowItWork,
	FAQ,
} from "../pageParts/Home";
import { ReactNode, useEffect } from "react";
import { Footer } from "../components/Footer";
import { useJujuStore } from "../zustand/store";
import { getExchangeList } from "../requests";
import { useQuery } from "@apollo/client";
import { GET_JUJU_STATS } from "../graphql/queries";
import PageLayout from "@/layouts/PageLayout";

const Home = () => {
	return (
		<main>
			<Hero />
			<SupportedBlockchains />
			<ExchangeYour />
			<SupportedAssets />
			<HowItWork />
			<FAQ />
			<Footer />
		</main>
	);
};

export default Home;

Home.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
