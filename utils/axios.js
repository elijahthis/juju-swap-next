import axios from "axios";
import { BASE_URL } from "../config/env";
import { getToken, setAuthToken } from "../config/helpers";

const options = {
	baseURL: BASE_URL,
	headers: {
		Accept: "application/json,text/plain,*/*",
		"Content-Type": "application/json",
	},
};

export const request = axios.create(options);
export const AuthRequest = axios.create(options);

request.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Token ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
