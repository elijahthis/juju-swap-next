import styles from "./styles.module.scss";
import { IoBrowsers } from "react-icons/io5";

const WhiteCard1 = ({
	data,
}: {
	data: {
		asset: string;
		icon: string;
		amount: string;
		rate: string;
	};
}) => {
	return (
		<div className={styles.WhiteCard1}>
			<div className={styles.WhiteCard1__asset}>
				<img src={data.icon} alt="" />
				<p>{data.asset}</p>
			</div>
			<p className={styles.WhiteCard1__amount}>{data.amount}</p>
			<div className={styles.WhiteCard1__rateView}>
				<p className={styles.rate}>{data.rate}</p>
				<div className={styles.view}>
					<IoBrowsers />
					<p>View on Explorer</p>
				</div>
			</div>
		</div>
	);
};

export default WhiteCard1;
