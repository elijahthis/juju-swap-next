import {
	Hero,
	SupportedBlockchains,
	ExchangeYour,
	SupportedAssets,
	HowItWork,
	FAQ,
} from "../pageParts/Home";
import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { useJujuStore } from "../zustand/store";
import { getExchangeList } from "../requests";
import { useQuery } from "@apollo/client";
import { GET_JUJU_STATS } from "../graphql/queries";

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
