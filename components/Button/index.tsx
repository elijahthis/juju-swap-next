import styles from "./styles.module.scss";
import { Spinner } from "@chakra-ui/react";

interface ButtonProps {
	children: JSX.Element | string;
	variant: "primary" | "secondary";
	type?: "button" | "submit" | "reset" | undefined;
	onClick?: () => void;
	disabled?: boolean;
	loading?: boolean;
}

const Button = ({
	children,
	variant,
	type = "button",
	onClick = () => {},
	loading = false,
	disabled = false,
}: ButtonProps) => {
	return (
		<button
			className={`${styles.Button} ${styles[`Button--${variant}`]}`}
			type={type}
			onClick={onClick}
		>
			{loading ? <Spinner w={15} h={15} color="#ffffff" /> : children}
		</button>
	);
};

export default Button;
