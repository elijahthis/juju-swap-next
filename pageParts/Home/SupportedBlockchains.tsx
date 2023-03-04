import { useEffect, useState } from "react";
import BlackCard from "../../components/BlackCard";
import styles from "./styles.module.scss";
import { useQuery } from "@apollo/client";
import { GET_JUJU_STATS } from "../../graphql/queries";
import { getChainList } from "../../requests";

export const SupportedBlockchains = () => {
	const {
		loading,
		error,
		data: jujuStats,
	} = useQuery(GET_JUJU_STATS, { pollInterval: 300000 });

	const [supportedChains, setSupportedChains] = useState<any[]>([]);

	useEffect(() => {
		const fetchFunc = async () => {
			try {
				if (!error && !loading)
					setSupportedChains(
						jujuStats?.getJujuStats?.activeChains?.map((item: any) => ({
							name: item?.name,
							logo: item?.logo,
						}))
					);
				else console.log(error);
			} catch (error) {
				console.log(error);
			}
		};

		fetchFunc();
	}, [loading]);

	const blockchains = Array(3)
		.fill(0)
		.map((item) => [
			{
				name: "BTC",
				acronym: "BTC",
			},
			{
				name: "Ethereum",
				acronym: "ETH",
			},
			{
				name: "Harmony",
				acronym: "ONE",
			},
			{
				name: "Solana",
				acronym: "SOL",
			},
		])
		.flat();

	console.log(jujuStats);
	return (
		<section
			className={`${styles.HomePageSection} ${styles.SupportedBlockchains}`}
		>
			<div>
				<BlackCard>
					<div className={styles.SupportedBlockchains__inner}>
						<h1>Supported Blockchains</h1>
						<p className={styles["sup-desc"]}>
							Currently, this platform support this blockchains below
						</p>
						<div className={styles.blockchainCards}>
							{supportedChains.map((item, ind) => (
								<div className={styles.blockchainCards__card} key={ind}>
									<img src={item?.logo} alt="" />
									<p>{item.name}</p>
								</div>
							))}
						</div>
					</div>
				</BlackCard>
			</div>
		</section>
	);
};
