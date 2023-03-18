import styles from "./styles.module.scss";
import { RiBankLine } from "react-icons/ri";
import { Switch } from "@mui/material";
import MUIToggle from "../MUIToggle";
import { useState } from "react";

interface AccountCardProps {
	accountData: {
		accountName: string;
		accountNumber: string;
		bank: string;
		default: boolean;
	};
}

const AccountCard = ({ accountData }: AccountCardProps) => {
	const [value, setValue] = useState(accountData.default);
	return (
		<div className={styles.AccountCard}>
			<div>
				<p className={styles.AccountCard__accountName}>
					{accountData.accountName}
				</p>
				<p className={styles.AccountCard__bank}>{accountData.bank}</p>
				<p className={styles.AccountCard__accountNumber}>
					{accountData.accountNumber}
				</p>
			</div>
			<div>
				<RiBankLine size={32} />
				<div>
					Default
					<MUIToggle value={value} setValue={setValue} />
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
