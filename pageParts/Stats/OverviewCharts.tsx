import tvl from "../../assets/images/TVL.png";
import styles from "./styles.module.scss";

export const OverviewCharts = () => {
	return (
		<section className={styles.OverviewCharts}>
			<div>
				<h4>Juju Swap Overview</h4>
				<div className={styles.OverviewCharts__charts}>
					<div>
						<img src={"/images/TVL.png"} alt="" />
					</div>
					<div>
						<img src={"/images/TVL.png"} alt="" />
					</div>
				</div>
			</div>
		</section>
	);
};
