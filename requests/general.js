import axios from "axios";
import { request } from "../utils/axios";

export const getExchangeList = async (vs_currency = "usd") => {
	try {
		const res = await request.get(`coins/markets?vs_currency=${vs_currency}`);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		throw err;
	}
};

export const getChainList = async (vs_currency = "usd") => {
	try {
		const res = await request.get(`asset_platforms`);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		throw err;
	}
};

export const getBankList = async () => {
	try {
		const res = await axios.get(`https://nigerianbanks.xyz/`);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		throw err;
	}
};

export const getAccountName = async (accountNumber, bankCode) => {
	console.log(accountNumber);
	console.log(bankCode);
	try {
		console.log(
			`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
		);
		const data = await axios({
			method: "get",
			headers: {
				"Content-Type": "application/json",
				Authorization:
					"Bearer sk_test_65c8a97e54dc8501c2b450faf8b7eb9810b85d85",
			},
			url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
		});
		return data;
	} catch (e) {
		console.log(e);
		throw e;
	}
};
