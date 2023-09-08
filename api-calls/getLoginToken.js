import * as nodeFetch from "node-fetch";
export const getLoginToken = async (username, password) => {
	const response = await nodeFetch("http://localhost:2221/api/login", {
		method: "POST",
		body: JSON.stringify({ username: username, password: password }),
	});
	// stop the execution is status code is not 200
	if (response.status !== 200) {
		throw new Error("An error occured trying to retrieve login token");
	}
	// returns response
	const body = await response.json();
	return body.token;
};
