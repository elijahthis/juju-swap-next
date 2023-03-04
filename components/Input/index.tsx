import styles from "./styles.module.scss";
import InputNumber from "react-input-number";
import { Spinner } from "@chakra-ui/react";

interface InputProps {
	type?: "text" | "number" | "wallet";
	value?: string | number;
	sidePiece?: string;
	max?: boolean;
	loading?: boolean;
	disabled?: boolean | undefined;
	onChange?: (e: any) => void;
	required?: boolean;
}

const Input = ({
	type = "text",
	value,
	sidePiece,
	max = false,
	loading = false,
	disabled = false,
	onChange,
	required = false,
}: InputProps) => {
	switch (type) {
		case "wallet":
			return (
				<div className={`${styles.Input} ${styles["Input--wallet"]}`}>
					<input
						type="text"
						value={value}
						disabled={disabled}
						// required={required}
					/>
				</div>
			);
			break;

		case "number":
			return (
				<div className={styles.Input}>
					<input
						type="text"
						value={value}
						disabled={disabled}
						onInput={(e) => {
							if (
								e.currentTarget.value.includes(".") &&
								!new RegExp(/^[0-9]*[.]{0,1}[0-9]*$/).test(
									e.currentTarget.value
								)
							)
								e.currentTarget.value = e.currentTarget.value.replace(
									/[.]/,
									""
								);
						}}
						onKeyPress={(e) => {
							const charCode = e.charCode || e.which;
							const keyValue = String.fromCharCode(charCode);
							const isValid = new RegExp(/[0-9.]/g).test(keyValue);
							if (!isValid) {
								e.preventDefault();
								return;
							}
						}}
						onChange={(e) => onChange && onChange(e)}
						required={required}
					/>
					{loading ? (
						<Spinner w={15} h={15} color="#000000" />
					) : (
						<>
							{sidePiece && (
								<div className={styles.Input__sidepiece}>{sidePiece}</div>
							)}
							{max && <div className={styles.Input__max}>Max</div>}
						</>
					)}
				</div>
			);
			break;

		default:
			return (
				<div className={styles.Input}>
					<input
						type="text"
						// value={value}
						disabled={disabled}
						onChange={(e) => onChange && onChange(e)}
						required={required}
					/>
					{loading ? (
						<Spinner w={15} h={15} color="#000000" />
					) : (
						<>
							{sidePiece && (
								<div className={styles.Input__sidepiece}>{sidePiece}</div>
							)}
							{max && <div className={styles.Input__max}>Max</div>}
						</>
					)}
				</div>
			);
			break;
	}
};

export default Input;
