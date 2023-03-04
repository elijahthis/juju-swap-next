import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
import styles from "./styles.module.scss";
import { Spinner } from "@chakra-ui/react";

export const PriceInfo = ({
	change,
	val = 0,
	priceChange = 0,
	loading = false,
}: {
	change: boolean;
	val: number;
	priceChange: number;
	loading?: boolean;
}) => {
	return (
		<div
			className={`${styles.PriceInfo} ${
				styles[`PriceInfo--${priceChange >= 0}`]
			}`}
		>
			{loading ? (
				<Spinner w={15} h={15} color="#ffffff" />
			) : (
				<>
					<span>
						₦{val === 0 ? "-" : val} (
						{`${priceChange >= 0 ? "+" : ""} ${priceChange}`}%)
					</span>
					<div className={styles.PriceInfo__arrow}>
						{change ? (
							<BsArrowUpShort size={12} />
						) : (
							<BsArrowDownShort size={12} />
						)}
					</div>
					<span>today</span>
				</>
			)}
		</div>
	);
};
