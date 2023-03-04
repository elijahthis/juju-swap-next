import styles from "./styles.module.scss";

const BlackCard = ({ children }: { children: JSX.Element }) => {
	return <div className={styles.BlackCard}>{children}</div>;
};

export default BlackCard;
