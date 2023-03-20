import AccountCard from "@/components/AccountCard";
import AssetSelect from "@/components/AssetSelect";
import BlackCard from "@/components/BlackCard";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import SpinnerComponent from "@/components/SpinnerComponent";
import { ADD_ACCOUNT_DETAILS } from "@/graphql/mutations";
import useDebounce from "@/hooks/useDebounce";
import PageLayout from "@/layouts/PageLayout";
import { getAccountName, getBankList } from "@/requests";
import { useJujuStore } from "@/zustand/store";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const Settings = () => {
	// zustand global states
	const bankList = useJujuStore((state: any) => state.bankList);
	const userID = useJujuStore((state: any) => state.userID);
	const userData = useJujuStore((state: any) => state.userData);
	const userLoading = useJujuStore((state: any) => state.userLoading);
	const userFunc = useJujuStore((state: any) => state.userFunc);

	const [accountNumber, setAccountNumber] = useState("");
	const [accountName, setAccountName] = useState("");
	const [bankObj, setBankObj] = useState({ name: "", code: "" });
	const [accountNameLoading, setAccountNameLoading] = useState(false);

	const debouncedAccountNumber = useDebounce(accountNumber, 1000);

	// populates the bank dropdown
	const bankOptions = bankList?.map((item: any) => ({
		value: item?.name,
		label: (
			<div className={styles.cryptoOption}>
				<img src={item?.logo} /> {item?.name}
			</div>
		),
		obj: { name: item?.name, code: item?.code, logo: item?.logo },
	}));

	const fetchAccountName = async () => {
		setAccountNameLoading(true);
		try {
			const res = await getAccountName(debouncedAccountNumber, bankObj.code);
			console.log(res);
			setAccountName(res?.data?.data?.account_name);
		} catch (e) {
			console.log(e);
			toast.error((e as any)?.response?.data?.message);
			setAccountName("");
		} finally {
			setAccountNameLoading(false);
		}
	};

	console.log("userID", userID);

	useEffect(() => {
		// fetches the account name using the debounced value of the account number
		if (debouncedAccountNumber.length > 5 && bankObj.name) fetchAccountName();
		else {
			setAccountName("");
		}
	}, [debouncedAccountNumber, bankObj.code]);

	const [addAcctDetailsMutation, { data, loading: addDetailsLoading, error }] =
		useMutation(ADD_ACCOUNT_DETAILS);

	return (
		<main className={styles.Settings}>
			<h3>Settings</h3>
			<div className={styles.Settings__block}>
				<h4>Bank Account Settings</h4>
				<BlackCard>
					<form
						action=""
						className={styles.Account__innerForm}
						onSubmit={(e) => {
							e.preventDefault();
							if (
								!accountNameLoading &&
								userID &&
								bankObj.name &&
								bankObj.code &&
								accountNumber &&
								accountName
							) {
								console.log({
									userId: userID?.id,
									accountNumber: accountNumber,
									accountName: accountName,
									bankName: bankObj.name,
									bankCode: bankObj.code,
								});

								addAcctDetailsMutation({
									variables: {
										userId: userID,
										accountNumber: accountNumber,
										accountName: accountName,
										bankName: bankObj.name,
										bankCode: bankObj.code,
									},
									onCompleted(data) {
										console.log("acctData", data);
										console.log("accterror", error);

										if (data?.addAccountDetails?.__typename === "Error")
											toast.error(data?.addAccountDetails?.message);
										else {
											toast.success("Account Details Updated");

											//reset values
											setAccountName("");
											setAccountNumber("");
											// setBankObj({ name: "", code: "" });
											userFunc();
										}
									},
									onError(error) {
										console.log(error);
										toast.error(error.message);
									},
								});
							}
						}}
					>
						<h4>Add Account</h4>
						<div>
							<Label>
								<AssetSelect
									options={bankOptions}
									onChange={(e: any) => {
										setBankObj(e.obj);
									}}
									// value={bankOptions[0]}
									defaultValue={bankOptions[0]}
								/>
							</Label>
							<Input
								value={accountNumber}
								sidePiece={accountName || "-"}
								onChange={(e) => setAccountNumber(e.target.value)}
								loading={accountNameLoading}
							/>
						</div>
						<Button
							variant="primary"
							type="submit"
							loading={addDetailsLoading}
							disabled={
								!(
									!accountNameLoading &&
									userID &&
									bankObj.name &&
									bankObj.code &&
									accountNumber &&
									accountName
								)
							}
						>
							Add Account
						</Button>
					</form>
				</BlackCard>

				{userLoading ? (
					<div style={{ padding: "3rem 0" }}>
						<SpinnerComponent color="#0c0b0e" size={50} />
					</div>
				) : (
					<div className={styles.accounts}>
						{userData?.accountDetails ? (
							userData?.accountDetails?.map((item: any) => (
								<AccountCard
									accountData={{
										id: item?.id,
										accountName: item?.accountName,
										accountNumber: item?.accountNumber,
										bank: item?.bank?.name,
										default: item?.default,
									}}
									key={item?.id}
								/>
							))
						) : (
							<></>
						)}
					</div>
				)}
			</div>
		</main>
	);
};

export default Settings;

Settings.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
