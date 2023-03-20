import styles from "./styles.module.scss";
import { RiBankLine, RiDeleteBin4Line } from "react-icons/ri";
import { Switch } from "@mui/material";
import MUIToggle from "../MUIToggle";
import { ChangeEvent, useState } from "react";
import {
	DELETE_ACCOUNT_DETAILS,
	SET_USER_MAIN_ACCOUNT,
} from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useJujuStore } from "@/zustand/store";
import MUIModal from "../MUIModal";
import { DeleteModal } from "../modals";
import { FALSE } from "sass";

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
	const [openDelete, setOpenDelete] = useState(false);

	const [setDefaultMutation, { data, loading: setDefaultLoading, error }] =
		useMutation(SET_USER_MAIN_ACCOUNT);

	const [
		deleteAccountMutation,
		{
			data: deleteAccountData,
			loading: deleteAccountLoading,
			error: deleteAccountError,
		},
	] = useMutation(DELETE_ACCOUNT_DETAILS);

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
		<>
			<div className={styles.AccountCard}>
				<div>
					<RiBankLine size={40} />
					<p className={styles.AccountCard__accountName}>
						{accountData.accountName}
					</p>
					<p className={styles.AccountCard__bank}>{accountData.bank}</p>
					<p className={styles.AccountCard__accountNumber}>
						{accountData.accountNumber}
					</p>
				</div>
				<div>
					<RiDeleteBin4Line
						size={28}
						color="#c70000"
						onClick={() => setOpenDelete(true)}
					/>
					<div>
						Default
						<MUIToggle value={value} onChange={handleChange} />
					</div>
				</div>
			</div>
			<MUIModal open={openDelete} handleClose={() => setOpenDelete(false)}>
				<DeleteModal
					title="Delete Bank Details"
					name={accountData.accountName}
					deleteFunc={() =>
						deleteAccountMutation({
							variables: {
								userId: userID,
								accountNumber: accountData.accountNumber,
								accountName: accountData.accountName,
							},
							onCompleted(data) {
								toast.success("Account details deleted");
								userFunc();
								setOpenDelete(false);
							},
							onError(error) {
								console.log(error);
								toast.error(error.message);
							},
						})
					}
					deleteLoading={deleteAccountLoading}
					closeModal={() => setOpenDelete(false)}
				/>
			</MUIModal>
		</>
	);
};

export default AccountCard;
