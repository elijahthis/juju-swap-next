import { GET_USER_ID } from "@/graphql/queries";
import { getBankList } from "@/requests";
import { useJujuStore } from "@/zustand/store";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const GeneralRequests = () => {
	// zustand global states
	const bankList = useJujuStore((state: any) => state.bankList);
	const userData = useJujuStore((state: any) => state.userData);
	const updateUserID = useJujuStore((state: any) => state.updateUserID);
	const updateBankList = useJujuStore((state: any) => state.updateBankList);

	//wagmi variables
	const { address } = useAccount();

	useEffect(() => {
		// fetch bank list
		const fetchFunc = async () => {
			try {
				const res = await getBankList();
				console.log("getBankList", res);
				updateBankList(res.data);
			} catch (e) {
				console.log(e);
			}
		};

		fetchFunc();
	}, []);

	// FETCH userId object (getUserId)
	const {
		loading: userIdLoading,
		error: userIdError,
		data: userIdObj,
	} = useQuery(GET_USER_ID, {
		pollInterval: 300000,
		variables: { eoa: address },
	});

	useEffect(() => {
		if (!userIdLoading && !userIdError) updateUserID(userIdObj?.getUserId[0]);
	}, [userIdLoading]);

	return <span></span>;
};

export default GeneralRequests;
