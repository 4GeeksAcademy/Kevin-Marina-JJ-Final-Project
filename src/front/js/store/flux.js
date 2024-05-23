import { jwtDecode } from "jwt-decode";

const getState = ({ getStore, setStore }) => {
	return {
		store: {
			token: sessionStorage.getItem("token") || "",
			role: sessionStorage.getItem("role") || null,
			user_id: sessionStorage.getItem("user_id") || null,
			routine: JSON.parse(sessionStorage.getItem("userRoutine")) || null,
			user_data: JSON.parse(sessionStorage.getItem("user_data")) || null,
			exerciseOptions: {
				method: 'GET',
				headers: {
					'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
					'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
				},
			},
			youtubeOptions: {
				method: 'GET',
				headers: {
					'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
					'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
				},
			},
		},
		actions: {
			logOut: () => {
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("role");
				sessionStorage.removeItem("user_id");
				sessionStorage.removeItem("userRoutine");
				sessionStorage.removeItem("user_data");
				setStore({ token: "", role: null, user_id: null, routine: null });
			},
			login: async (loginData) => {
				const response = await fetch(`${process.env.BACKEND_URL}/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(loginData),
				});
				if (response.ok) {
					const data = await response.json();
					const decoded = jwtDecode(data.access_token);
					sessionStorage.setItem("token", data.access_token);
					sessionStorage.setItem("role", decoded.role);
					sessionStorage.setItem("user_id", decoded.sub);
					setStore({ token: data.access_token, role: decoded.role, user_id: decoded.sub });
				} else {
					alert("Wrong user or password");
				}
			},
			signUp: async (email, password) => {
				const response = await fetch(process.env.BACKEND_URL + "/signup", {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(email, password)
				})
				if (!response.ok) {
					alert("Error registering");
				}
				if (response.ok) {
					const data = await response.json()
					const decoded = jwtDecode(data.access_token);
					sessionStorage.setItem("token", data.access_token);
					setStore({ user_id: decoded.sub, token: data.access_token, role: decoded.role });
					return true;
				}
			},
			postUserData: async (formData) => {
				const store = getStore()
				const decoded = jwtDecode(store.token);
				const response = await fetch(`${process.env.BACKEND_URL}/user_data/${decoded.sub}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: "Bearer " + store.token
					},
					body: JSON.stringify(formData),
				});

				if (response.ok) {
					const updatedUserData = await response.json();
					sessionStorage.setItem("user_data", JSON.stringify(updatedUserData));
					setStore({ user_data: updatedUserData });
				} else {
					console.error('Error sending user data');
				}
			},
			fetchUserData: async () => {
				const store = getStore();
				const userDataFromSession = sessionStorage.getItem("user_data");

				if (userDataFromSession) {
					setStore({ user_data: JSON.parse(userDataFromSession) });
				} else {
					try {
						const response = await fetch(`${process.env.BACKEND_URL}/user_data/${store.user_id}`, {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
								'Authorization': 'Bearer ' + store.token
							}
						});

						if (response.ok) {
							const userData = await response.json();
							sessionStorage.setItem("user_data", JSON.stringify(userData));
							setStore({ user_data: userData });
						} else {
							console.error('Error fetching user data:', response.statusText);
						}
					} catch (error) {
						console.error('Error fetching user data:', error);
					}
				}
			},
			fetchDataExercise: async (url, options) => {
				const cacheKey = `exerciseData_${url}`;
				const cachedData = localStorage.getItem(cacheKey);

				if (cachedData) {
					return JSON.parse(cachedData);
				}

				const response = await fetch(url, options);
				const data = await response.json();
				localStorage.setItem(cacheKey, JSON.stringify(data));
				return data;
			},
			fetchDataRoutine: async () => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/user/${store.user_id}/actual_routine`, {
						headers: {
							'Authorization': `Bearer ${store.token}`
						}
					});

					if (response.ok) {
						const data = await response.json();
						sessionStorage.setItem('userRoutine', JSON.stringify(data.actual_routine));
						setStore({ routine: data.actual_routine });
					} else {
						console.error('Error fetching routine:', response.statusText);
					}
				} catch (error) {
					console.error('Error fetching routine:', error);
				}
			},
		},
	};
};

export default getState;