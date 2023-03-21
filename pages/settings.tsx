import AccountCard from "@/components/AccountCard";
import AssetSelect from "@/components/AssetSelect";
import BlackCard from "@/components/BlackCard";
import BlackTabs from "@/components/BlackTabs";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import SpinnerComponent from "@/components/SpinnerComponent";
import { ADD_ACCOUNT_DETAILS } from "@/graphql/mutations";
import useDebounce from "@/hooks/useDebounce";
import PageLayout from "@/layouts/PageLayout";
import BankAccounts from "@/pageParts/Settings/BankAccounts";
import KYC from "@/pageParts/Settings/KYC";
import { getAccountName, getBankList } from "@/requests";
import { useJujuStore } from "@/zustand/store";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";

const Settings = () => {
	const tabList = ["KYC", "Bank Accounts"];

	const router = useRouter();
	const hash = router.asPath.includes("#") ? router.asPath.split("#")[1] : null;

	const renderContent = () => {
		switch (hash) {
			case encodeURIComponent(tabList[0]):
				return <KYC />;
				break;
			case encodeURIComponent(tabList[1]):
				return <BankAccounts />;
				break;

			default:
				return <BankAccounts />;
				break;
		}
	};

	return (
		<main className={styles.Settings}>
			<BlackTabs tabItems={tabList} />
			<section className={styles.Settings__body}>
				{/* <h3>Settings</h3> */}
				{renderContent()}
			</section>
		</main>
	);
};

export default Settings;

Settings.getLayout = function getLayout(page: ReactNode) {
	return <PageLayout>{page}</PageLayout>;
};
