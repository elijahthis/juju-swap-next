export const getToken = () => {
	return localStorage.getItem("jujuToken");
};

export const setAuthToken = (token) => {
	localStorage.setItem("jujuToken", token);
};
