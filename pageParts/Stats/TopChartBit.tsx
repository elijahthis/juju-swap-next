import styles from "./styles.module.scss";
import WhiteCard1 from "../../components/WhiteCard1";
import WhiteCard2 from "../../components/WhiteCard2";
import wngn from "../../assets/images/wngn.svg";
import liquidity from "../../assets/images/liquidity.png";
import volume from "../../assets/images/volume.png";

export const TopChartBit = () => {
	const cardList2 = [
		{ tag: "Liquidity (24hr)", change: +23.55, amount: "$560,000,000" },
		{ tag: "ٍVolume (24hr)", change: -3.12, amount: "$560,000,000" },
		{ tag: "Fee (24hr)", change: +9, amount: "$560,000,000" },
		{ tag: "Tx (24hr)", change: +7, amount: "$560,000,000" },
		{ tag: "Average trade (24hr)", change: +2.25, amount: "$560,000,000" },
		{ tag: "Utilisation (24hr)", change: -1.2, amount: "$560,000,000" },
	];

	return (
		<section className={styles.TopChartBit}>
			<div>
				<div className={styles.TopChartBit__head}>
					<img src={wngn} alt="" />
					<img
						src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`}
						alt=""
					/>
					<p>ETH/WNGN</p>
				</div>
				<div className={styles.TopChartBit__cards}>
					<WhiteCard1
						data={{
							asset: "Ethereum (ETH)",
							icon: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png`,
							amount: "$560,000",
							rate: "1ETH = 0.00456 WNGN ($53.4)",
						}}
					/>
					<WhiteCard1
						data={{
							asset: "WNGN",
							icon: wngn,
							amount: "$560,000",
							rate: "1WNGN = 0.00456 ETH ($53.4)",
						}}
					/>
				</div>
				<div className={styles.TopChartBit__cards}>
					<img src={liquidity} alt="" />
					<img src={volume} alt="" />
				</div>
				<div className={styles.TopChartBit__cards2}>
					{cardList2.map((cardItem, ind) => (
						<WhiteCard2 data={cardItem} key={ind} />
					))}
				</div>
			</div>
		</section>
	);
};
