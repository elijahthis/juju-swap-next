import styles from "./styles.module.scss";

const Label = ({ children }: { children: JSX.Element | string }) => {
	return (
		<label htmlFor="" className={styles.Label}>
			{children}
		</label>
	);
};

export default Label;
