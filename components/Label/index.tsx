import { ReactNode } from "react";
import styles from "./styles.module.scss";

const Label = ({ children }: { children: ReactNode }) => {
	return (
		<label htmlFor="" className={styles.Label}>
			{children}
		</label>
	);
};

export default Label;
