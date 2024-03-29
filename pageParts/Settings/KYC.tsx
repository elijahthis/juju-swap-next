import AssetSelect from "@/components/AssetSelect";
import BlackCard from "@/components/BlackCard";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import { useJujuStore } from "@/zustand/store";
import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./styles.module.scss";
import UploadImage from "@/components/UploadImage";
import { ADD_KYC_DETAILS, UPDATE_KYC_DETAILS } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";

const KYC = () => {
	const userID = useJujuStore((state: any) => state.userID);
	const userData = useJujuStore((state: any) => state.userData);
	const userFunc = useJujuStore((state: any) => state.userFunc);

	const [formData, setFormData] = useState({
		identificationFirstName: "",
		identificationMiddleName: "",
		identificationLastName: "",
		identificationNumber: "",
		identificationType: "PASSPORT",
		identificationImage: "",
	});

	const updateFormData = (key: string, val: any) => {
		setFormData({ ...formData, [key]: val });
	};

	const identificationTypeOptions = [
		{
			value: "PASSPORT",
			label: (
				<div className={styles.cryptoOption}>
					<p>Passport</p>
				</div>
			),
		},
		{
			value: "DRIVERS_LICENSE",
			label: (
				<div className={styles.cryptoOption}>
					<p>Driver's License</p>
				</div>
			),
		},
		{
			value: "NATIONAL_ID",
			label: (
				<div className={styles.cryptoOption}>
					<p>National ID</p>
				</div>
			),
		},
	];

	const [
		addKycMutation,
		{ data: addKycData, loading: addKycLoading, error: addKycError },
	] = useMutation(ADD_KYC_DETAILS);

	const [
		updateKycMutation,
		{ data: updateKycData, loading: updateKycLoading, error: updateKycError },
	] = useMutation(UPDATE_KYC_DETAILS);

	return (
		<div className={styles.KYC}>
			<h4>KYC</h4>
			<BlackCard>
				<form
					action=""
					className={styles.KYC__innerForm}
					onSubmit={(e) => {
						e.preventDefault();
						if (!Object.values(formData).includes("")) {
							console.log("formData", formData);

							if (userData?.kyc === null)
								addKycMutation({
									variables: {
										userId: userID,
										...formData,
									},
									onCompleted(data) {
										console.log("kycdata", data);

										if (data?.addKYC?.__typename === "Error")
											toast.error(data?.addKYC?.message);
										else {
											toast.success("KYC Details Added");

											userFunc();
										}
									},
									onError(error) {
										console.log(error);
										toast.error(error.message);
									},
								});
							else
								updateKycMutation({
									variables: {
										userId: userID,
										...formData,
									},
									onCompleted(data) {
										console.log("kycdata", data);

										if (data?.updateKYC?.__typename === "Error")
											toast.error(data?.updateKYC?.message);
										else {
											toast.success("KYC Details Updated");

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
					<h4>Update KYC</h4>
					<div className={styles.doubleDiv}>
						<Label>
							<p className={styles.whiteLbl}>First Name</p>
							<Input
								value={formData.identificationFirstName}
								onChange={(e) =>
									updateFormData("identificationFirstName", e.target.value)
								}
							/>
						</Label>
						<Label>
							<p className={styles.whiteLbl}>Middle Name</p>
							<Input
								value={formData.identificationMiddleName}
								onChange={(e) =>
									updateFormData("identificationMiddleName", e.target.value)
								}
							/>
						</Label>
					</div>
					<div>
						<Label>
							<p className={styles.whiteLbl}>Last Name</p>
							<Input
								value={formData.identificationLastName}
								onChange={(e) =>
									updateFormData("identificationLastName", e.target.value)
								}
							/>
						</Label>
					</div>
					<div>
						<Label>
							<p className={styles.whiteLbl}>Identification Type</p>
							<AssetSelect
								options={identificationTypeOptions}
								onChange={(e: any) => {
									updateFormData("identificationType", e?.value);
								}}
								// value={bankOptions[0]}
								defaultValue={identificationTypeOptions[0]}
							/>
							{/* <Input value={formData.identificationType} /> */}
						</Label>
						<Label>
							<p className={styles.whiteLbl}>Identification Number</p>
							<Input
								value={formData.identificationNumber}
								onChange={(e) =>
									updateFormData("identificationNumber", e.target.value)
								}
							/>
						</Label>
					</div>
					<div>
						<Label>
							<p className={styles.whiteLbl}>Identification Image</p>
							<UploadImage
								onFileSelect={(file) => {
									// updateFormData("identificationImage", file.name);
								}}
							/>
						</Label>
					</div>
					<Button
						variant="primary"
						type="submit"
						// loading={addDetailsLoading}
						disabled={Object.values(formData).includes("")}
					>
						{userData?.kyc === null ? "Add Details" : "Update Details"}
					</Button>
				</form>
			</BlackCard>
		</div>
	);
};

export default dynamic(() => Promise.resolve(KYC), { ssr: false });
