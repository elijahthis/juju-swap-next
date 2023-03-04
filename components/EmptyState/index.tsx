import styles from "./styles.module.scss";

interface EmptyStateProps {
	title?: string;
	body?: string;
}

const EmptyState = ({
	title = "Bummer",
	body = "Nothing to see here",
}: EmptyStateProps) => {
	return (
		<div className={styles.EmptyState}>
			<h4>{title}</h4>
			<p>{body}</p>
		</div>
	);
};

export default EmptyState;
