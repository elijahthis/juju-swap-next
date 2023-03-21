import { GET_USER, GET_USER_ID } from "@/graphql/queries";
import { getBankList } from "@/requests";
import { useJujuStore } from "@/zustand/store";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const GeneralRequests = () => {
	// zustand global states
	const bankList = useJujuStore((state: any) => state.bankList);
	const userData = useJujuStore((state: any) => state.userData);
	const userSigned = useJujuStore((state: any) => state.userSigned);
	const updateUserData = useJujuStore((state: any) => state.updateUserData);
	const updateUserFunc = useJujuStore((state: any) => state.updateUserFunc);
	const updateUserLoading = useJujuStore(
		(state: any) => state.updateUserLoading
	);
	const userID = useJujuStore((state: any) => state.userID);
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

	// FETCH userId (getUserId)
	const {
		loading: userIdLoading,
		error: userIdError,
		data: userIdObj,
	} = useQuery(GET_USER_ID, {
		pollInterval: 300000,
		variables: { eoa: address },
	});

	// FETCH user object (getUser)
	const [
		getUserFunc,
		{ loading: userObjLoading, error: userObjError, data: userObj },
	] = useLazyQuery(GET_USER, {
		variables: { userId: userID },
		fetchPolicy: "no-cache",
	});

	useEffect(() => {
		if (!userIdLoading && !userIdError) {
			updateUserID(userIdObj?.getUserId?.id);
			getUserFunc();
			updateUserFunc(getUserFunc);
		}
	}, [userIdLoading]);

	useEffect(() => {
		updateUserLoading(userObjLoading);
		if (!userObjLoading && !userObjError) updateUserData(userObj?.getUser);
	}, [userObjLoading]);

	console.log("userID", userID);
	console.log("userData", userData);
	console.log("userSigned", userSigned);

	return <span></span>;
};

export default GeneralRequests;
