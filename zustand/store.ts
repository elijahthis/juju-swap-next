import create from "zustand";

export const useJujuStore = create((set: any) => ({
	newLogin: 0,
	updateNewLogin: () => set((state: any) => ({ newLogin: state.newLogin + 1 })),

	userData: {},
	updateUserData: (values: any) =>
		set((state: any) => ({ userData: { ...state.userData, ...values } })),

	marketData: [],
	updateMarketData: (values: any) =>
		set((state: any) => ({ marketData: values })),

	rainbowKey: 1234,
	updateRainbowKey: (value: number) =>
		set((state: any) => ({ rainbowKey: value })),
}));
