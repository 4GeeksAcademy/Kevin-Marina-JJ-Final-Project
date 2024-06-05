import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const getState = ({ getStore, setStore }) => {
	return {
		store: {
			token: sessionStorage.getItem("token") || "",
			role: sessionStorage.getItem("role") || null,
			user_id: sessionStorage.getItem("user_id") || null,
			routine: JSON.parse(sessionStorage.getItem("userRoutine")) || null,
			user_data: JSON.parse(sessionStorage.getItem("user_data")) || null,
			user_image: sessionStorage.getItem("user_image") || null,
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
				sessionStorage.removeItem("user_image");
				setStore({ token: "", role: null, user_id: null, routine: null, user_image: null });
				Swal.fire({
					title: "Logged out",
					text: "You have been logged out",
					type: "success",
					showConfirmButton: false,
					timer: 1000,
				});
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
					Swal.fire({
						title: "Logged in",
						text: "You have been logged in",
						type: "success",
						showConfirmButton: false,
						timer: 1000,
					});
				} else {
					Swal.fire({
						title: "Error",
						text: "Wrong user or password",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					});
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
					Swal.fire({
						title: "Error",
						text: "Error registering",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					});
				}
				if (response.ok) {
					const data = await response.json()
					sessionStorage.setItem("token", data.access_token);
					setStore({ token: data.access_token });
					Swal.fire({
						title: "Success",
						text: "You have been registered",
						type: "success",
						showConfirmButton: false,
						timer: 1000,
					});
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
					sessionStorage.setItem("role", decoded.role);
					sessionStorage.setItem("user_id", decoded.sub);
					setStore({ user_id: decoded.sub, role: decoded.role });
				} else {
					Swal.fire({
						title: "Error",
						text: "Error sending user data",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					});
				}
			},
			deleteUser: async (userId) => {
				const store = getStore();

				const response = await fetch(`${process.env.BACKEND_URL}/delete_user/${userId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: "Bearer " + store.token
					},
				});
				if (response.ok) {
					Swal.fire({
						title: "Success",
						text: "User deleted",
						type: "success",
						showConfirmButton: false,
						timer: 1000,
					});
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
								Authorization: 'Bearer ' + store.token
							}
						});

						if (response.ok) {
							const userData = await response.json();
							sessionStorage.setItem("user_data", JSON.stringify(userData));
							setStore({ user_data: userData });
						} else {
							Swal.fire({
								title: "Error",
								text: "Error fetching user data",
								type: "error",
								showConfirmButton: false,
								timer: 1000,
							});

						}
					} catch (error) {
						Swal.fire({
							title: "Error",
							text: "Error fetching user data",
							type: "error",
							showConfirmButton: false,
							timer: 1000,
						});
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
							Authorization: `Bearer ${store.token}`
						}
					});

					if (response.ok) {
						const data = await response.json();
						sessionStorage.setItem('userRoutine', JSON.stringify(data.actual_routine));
						setStore({ routine: data.actual_routine });
					} else {
						/* Swal.fire({
							title: "Error",
							text: "No routine yet",
							type: "error",
							showConfirmButton: false,
							timer: 1000,
						}); */

					}
				} catch (error) {
					/* Swal.fire({
						title: "Error",
						text: "No routine yet",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					}); */
				}
			},
			patchUserData: async (formData) => {
				const store = getStore();
				const response = await fetch(`${process.env.BACKEND_URL}/user_data/${store.user_id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': "Bearer " + store.token
					},
					body: JSON.stringify(formData),
				});
				if (response.ok) {
					const data = await response.json();
					sessionStorage.setItem("user_data", JSON.stringify(data));
					setStore({ user_data: data });
				} else {
					Swarl.fire({
						title: "Error",
						text: "Error editing user data",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					});
				}
			},
			/* fetchUserImage: async () => {
				const store = getStore();
				try {
					const imgResponse = await fetch(`${process.env.BACKEND_URL}/user/${store.user_id}/profile_picture`, {
						headers: {
							Authorization: 'Bearer ' + store.token
						}
					});

					if (imgResponse.ok) {
						const imgData = await imgResponse.json();
						const userImage = `data:${imgData.mimetype};base64,${imgData.img}`;
						sessionStorage.setItem("user_image", userImage);
						setStore({ user_image: userImage });
					} else {

						Swal.fire({
							title: "Error",
							text: "Error fetching user image",
							type: "error",
							showConfirmButton: false,
							timer: 1000,
						}) ;
					}
				} catch (error) {
					Swal.fire({
						title: "Error",
						text: "Error fetching user image",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					});
				}
			},
			updateUserImage: async (file) => {
				const store = getStore();
				const formData = new FormData();
				formData.append("user_profile_picture", file);
				const method = store.user_image ? 'PUT' : 'POST';

				try {
					const response = await fetch(`${process.env.BACKEND_URL}/user/${store.user_id}/profile_picture`, {
						method: method,
						headers: {
							Authorization: `Bearer ${store.token}`
						},
						body: formData,
					});

					if (response.ok) {
						const data = await response.json();
						console.log(data);
						sessionStorage.setItem("user_image", data.img);
						setStore({ user_image: data.img });
						Swal.fire({
							title: "Success",
							text: "Profile picture updated successfully",
							type: "success",
							showConfirmButton: false,
							timer: 1000,
						});
					} else {
						Swal.fire({
							title: "Error",
							text: "Error updating user image",
							type: "error",
							showConfirmButton: false,
							timer: 1000,
						});
					}
				} catch (error) {
					console.error('Error updating user image:', error);
					Swal.fire({
						title: "Error",
						text: "An error occurred while updating the profile picture",
						type: "error",
						showConfirmButton: false,
						timer: 1000,
					});
				}
			} */

		},
	};
};

export default getState;