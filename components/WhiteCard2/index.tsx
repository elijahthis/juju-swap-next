import styles from "./styles.module.scss";
import { IoBrowsers } from "react-icons/io5";

const WhiteCard2 = ({
	data,
}: {
	data: {
		tag: string;
		amount: string;
		change: number;
	};
}) => {
	return (
		<div className={styles.WhiteCard2}>
			<div className={styles.WhiteCard2__head}>
				<span className={styles.WhiteCard2__tag}>{data.tag}</span>
				<span
					className={`${styles.WhiteCard2__change} ${
						styles[
							`WhiteCard2__change${
								data.change < 0 ? "--negative" : "--positive"
							}`
						]
					}`}
				>
					{data.change < 0 ? "" : "+"}
					{data.change}
				</span>
			</div>
			<p className={styles.WhiteCard2__amount}>{data.amount}</p>
		</div>
	);
};

export default WhiteCard2;
