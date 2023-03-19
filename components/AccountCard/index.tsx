import styles from "./styles.module.scss";
import { RiBankLine } from "react-icons/ri";
import { Switch } from "@mui/material";
import MUIToggle from "../MUIToggle";
import { ChangeEvent, useState } from "react";
import { SET_USER_MAIN_ACCOUNT } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useJujuStore } from "@/zustand/store";

interface AccountCardProps {
	accountData: {
		id: string;
		accountName: string;
		accountNumber: string;
		bank: string;
		default: boolean;
	};
}

const AccountCard = ({ accountData }: AccountCardProps) => {
	//zustand
	const userID = useJujuStore((state: any) => state.userID);
	const userFunc = useJujuStore((state: any) => state.userFunc);

	const [value, setValue] = useState(accountData.default);

	const [setDefaultMutation, { data, loading: setDefaultLoading, error }] =
		useMutation(SET_USER_MAIN_ACCOUNT);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.checked);

		if (e.target.checked)
			setDefaultMutation({
				variables: {
					userId: userID,
					accountId: accountData.id,
				},
				onCompleted(data) {
					console.log("acctData", data);
					toast.success("Default Account Updated");
					userFunc();
				},
				onError(error) {
					console.log(error);
					toast.error(error.message);
				},
			});
	};

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
					<MUIToggle value={value} onChange={handleChange} />
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
