import styles from "./styles.module.scss";
import { Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";

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
		<motion.button
			className={`${styles.Button} ${styles[`Button--${variant}`]}`}
			type={type}
			onClick={() => {
				if (!loading && !disabled) onClick();
			}}
			whileHover={{ scale: 1.04 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: "spring" }}
		>
			{loading ? <Spinner w={15} h={15} color="#ffffff" /> : children}
		</motion.button>
	);
};

export default Button;
