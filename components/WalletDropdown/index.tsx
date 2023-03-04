import styles from "./styles.module.scss";
import { IoChevronDownOutline } from "react-icons/io5";

interface WalletDropdownProps {
	list: string[];
	label: string;
	selectedWallet: string;
	setSelectedWallet: () => void;
}

const WalletDropdown = ({
	list,
	label,
	selectedWallet,
	setSelectedWallet,
}: WalletDropdownProps) => {
	return (
		<div className={styles.WalletDropdown}>
			<div>
				<p className={styles.WalletDropdown__label}>{label}</p>
				<p className={styles.WalletDropdown__wallet}>{selectedWallet}</p>
			</div>
			<div className={styles.chevron}>
				<IoChevronDownOutline color="#ffffff" />
			</div>
		</div>
	);
};

export default WalletDropdown;
