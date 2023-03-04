import { Spinner } from "@chakra-ui/react";
import styles from "./styles.module.scss";

const SpinnerComponent = ({
	color,
	size = 15,
}: {
	color?: string;
	size?: number;
}) => {
	return (
		<div className={styles.SpinnerComponent}>
			<Spinner color={color ? color : "#ffffff"} w={size} height={size} />
		</div>
	);
};

export default SpinnerComponent;
