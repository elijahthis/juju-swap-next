import styles from "./styles.module.scss";
import Button from "../../components/Button";
import heroImg from "../../assets/images/hero-img.png";
import sellProto from "../../assets/images/sell proto.png";
import { useRouter } from "next/router";

export const ExchangeYour = () => {
	const router = useRouter();

	return (
		<section
			className={`${styles.HomePageSection} ${styles.Hero} ${styles.ExchangeYour}`}
		>
			<div>
				<div>
					<div className={styles.bulkk}>
						<h1>Exchange your crypto seamlessly.</h1>
						<img
							src={"/images/sell proto.png"}
							alt=""
							className={styles["mob-img"]}
						/>
						<p>
							Sell and buy your crypto directly and get paid, all in your local
							currency. Sell and buy your crypto directly and get paid, all in
							your local currency. Sell and buy your crypto directly and get
							paid, all in your local currency.
						</p>
						<Button variant="primary" onClick={() => router.push("/exchange")}>
							Get Started
						</Button>
					</div>
					<img
						src={"/images/sell proto.png"}
						alt=""
						className={styles["web-img"]}
					/>
				</div>
			</div>
		</section>
	);
};
