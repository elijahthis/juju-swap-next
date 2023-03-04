import styles from "./styles.module.scss";
import Button from "../../components/Button";
import heroImg from "../../assets/images/hero-img.png";
import mobileHeroImg from "../../assets/images/mobile-hero-img.svg";
import { useQuery } from "@apollo/client";
import { GET_JUJU_STATS } from "../../graphql/queries";
import { useRouter } from "next/router";

export const Hero = () => {
	const router = useRouter();

	const {
		loading,
		error,
		data: jujuStats,
	} = useQuery(GET_JUJU_STATS, { pollInterval: 300000 });

	const analytics = [
		{
			label: "users",
			val: Intl.NumberFormat("en-US", {
				notation: "compact",
				maximumFractionDigits: 1,
			}).format(jujuStats?.getJujuStats?.totalUsers),
		},
		{
			label: "cryptocurrencies",
			val: Intl.NumberFormat("en-US", {
				notation: "compact",
				maximumFractionDigits: 1,
			}).format(jujuStats?.getJujuStats?.supportedAssets?.length),
		},
		{ label: "quarterly volume traded", val: "₦0" },
	];

	console.log("jujuStats", jujuStats);

	return (
		<section className={`${styles.HomePageSection} ${styles.Hero}`}>
			<div>
				<div>
					<div className={styles.bulkk}>
						<h1>Buy and Sell Crypto with your local currency.</h1>
						<p>
							Sell and buy your crypto directly and get paid, all in your local
							currency.
						</p>
						<Button variant="primary" onClick={() => router.push("/exchange")}>
							Get Started
						</Button>
					</div>
					<div>
						<img
							src={"/images/hero-img.png"}
							alt=""
							className={styles["hero-img"]}
						/>
						<img
							src={mobileHeroImg}
							alt=""
							className={styles["mobile-hero-img"]}
						/>
					</div>
				</div>
				<div className={styles.Hero__analytics}>
					{analytics.map((item, ind) => (
						<div key={ind}>
							<h3>{item.val}</h3>
							<p>{item.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
