import { request } from "../utils/axios";
import { AuthRequest } from "../utils/axios";
import { setAuthToken } from "../config/helpers";
import { toast } from "react-toastify";

export const userLogin = async (values) => {
	try {
		const res = await AuthRequest.post("auth/login/", values);
		console.log(res);
		setAuthToken(res?.data?.key);
		return res;
	} catch (err) {
		if (
			err?.response?.data?.non_field_errors[0] ===
			"Account not verified, Kindly Contact Support"
		) {
			toast.error(err?.response?.data?.non_field_errors[0]); //unverified account error
		} else toast.error("Error: Invalid Username/Password"); // invalid details error notification

		console.log(err?.response?.data);
		console.log(err?.response?.data?.email[0]);
		throw err;
	}
};

export const sendOtp = async (values) => {
	try {
		const res = await AuthRequest.post("api/accounts/validate_email", values);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		console.log(err?.response?.data?.message);
		throw err;
	}
};

export const confirmOtp = async (values) => {
	try {
		const res = await AuthRequest.post("api/accounts/confirm_email", values);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		console.log(err?.response?.data?.message);
		throw err;
	}
};

export const registerUser = async (values) => {
	try {
		const res = await AuthRequest.post("auth/registration/", values);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		for (let i in err?.response?.data) {
			toast.error(err?.response?.data[i][0]);
		}
		toast.error(err?.response?.data?.message);
		throw err;
	}
};

export const requestPasswordResetToken = async (values) => {
	try {
		const res = await AuthRequest.post("auth/password_reset/", values);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		for (let i in err?.response?.data) {
			toast.error(err?.response?.data[i][0]);
		}
		console.log(err?.response?.data?.message);
		throw err;
	}
};

export const confirmPasswordResetToken = async (values) => {
	try {
		const res = await AuthRequest.post("auth/password_reset/confirm/", values);
		console.log(res);
		return res;
	} catch (err) {
		console.log(err?.response?.data);
		if (err?.response?.data?.detail === "Not found.") {
			toast.error("Incorrect token");
		} else {
			for (let i in err?.response?.data) {
				toast.error(err?.response?.data[i][0]);
			}
		}
		console.log(err?.response?.data?.message);
		throw err;
	}
};
