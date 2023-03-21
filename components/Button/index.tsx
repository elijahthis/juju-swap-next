import styles from "./styles.module.scss";
import { Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface ButtonProps {
	children: JSX.Element | string;
	variant: "primary" | "secondary" | "delete";
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
		<motion.button
			className={`${styles.Button} ${styles[`Button--${variant}`]} ${
				disabled && styles[`Button--disabled`]
			}`}
			type={type}
			onClick={() => {
				if (!loading && !disabled) onClick();
			}}
			whileHover={{ scale: disabled ? 1 : 1.04 }}
			whileTap={{ scale: disabled ? 1 : 0.9 }}
			transition={{ type: "spring" }}
			disabled={disabled}
		>
			{loading ? <Spinner w={15} h={15} color="#ffffff" /> : children}
		</motion.button>
	);
};

export default Button;
