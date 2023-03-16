import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { AppContext, AppInitialProps, AppLayoutProps } from "next/app";
import type { NextComponentType } from "next";

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	gql,
} from "@apollo/client";

import Header from "@/components/Header";
import { useJujuStore } from "@/zustand/store";
import { getExchangeList } from "@/requests";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//RainbowKit imports
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ReactNode } from "react";

//apollo setup
export const apolloClient = new ApolloClient({
	uri: "https://api.jujuswap.com/",

	cache: new InMemoryCache(),
});

// Rainbowkit setup
const { chains, provider } = configureChains(
	[mainnet, polygon, optimism, arbitrum],
	[
		alchemyProvider({ apiKey: "XbL3RdiNjKaef-JbO62T2YsjDFzs_cU8" }),
		publicProvider(),
	]
);
const { connectors } = getDefaultWallets({
	appName: "Juju Swap",
	chains,
});
const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const App: NextComponentType<AppContext, AppInitialProps, AppLayoutProps> = ({
	Component,
	pageProps,
}: AppLayoutProps) => {
	const getLayout = Component.getLayout || ((page: ReactNode) => page);

	const rainbowKey = useJujuStore((state: any) => state.rainbowKey);

	const returnedComponent = getLayout(
		<div className="App">
			<Component {...pageProps} />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={true}
			/>
		</div>
	);

	return (
		<ApolloProvider client={apolloClient}>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider chains={chains} key={rainbowKey}>
					<Header />
					{returnedComponent}
				</RainbowKitProvider>
			</WagmiConfig>
		</ApolloProvider>
	);
};

export default App;
