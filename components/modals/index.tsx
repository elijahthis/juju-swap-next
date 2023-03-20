import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import Button from "../Button";

export const DeleteModal = ({
	title,
	name,
	desc = "",
	deleteFunc,
	deleteLoading,
	closeModal,
}: {
	title: string;
	name: string;
	desc?: string;
	deleteFunc: () => void;
	deleteLoading: boolean;
	closeModal: () => void;
}) => (
	<div className={styles.DeleteModal}>
		<h3>{title}</h3>
		<p className={styles.DeleteModal__desc}>
			{desc || `Are you sure you want to delete ${name}`}
		</p>
		<div className={styles.DeleteModal__btnWrap}>
			<Button
				variant="delete"
				onClick={() => deleteFunc()}
				loading={deleteLoading}
			>
				Delete
			</Button>
			<Button variant="delete" onClick={() => closeModal()}>
				Cancel
			</Button>
		</div>
	</div>
);
