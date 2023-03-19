import create from "zustand";

export const useJujuStore = create((set: any) => ({
	newLogin: 0,
	updateNewLogin: () => set((state: any) => ({ newLogin: state.newLogin + 1 })),

	userData: {},
	updateUserData: (values: any) =>
		set((state: any) => ({ userData: { ...state.userData, ...values } })),

	//this keeps track of whether the user has signed
	userSigned: false,
	updateUserSigned: (value: boolean) =>
		set((state: any) => ({ userSigned: value })),

	//this reloads the getUser query
	userFunc: () => {},
	updateUserFunc: (value: any) => set((state: any) => ({ userFunc: value })),

	//this keeps track of the loading state of the getUser query
	userLoading: false,
	updateUserLoading: (value: boolean) =>
		set((state: any) => ({ userLoading: value })),

	userID: "",
	updateUserID: (value: any) => set((state: any) => ({ userID: value })),

	marketData: [],
	updateMarketData: (values: any) =>
		set((state: any) => ({ marketData: values })),

	bankList: [],
	updateBankList: (values: any) => set((state: any) => ({ bankList: values })),

	rainbowKey: 1234,
	updateRainbowKey: (value: number) =>
		set((state: any) => ({ rainbowKey: value })),
}));
