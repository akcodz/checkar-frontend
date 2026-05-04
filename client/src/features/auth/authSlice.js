import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/auth";

export const loginUser = createAsyncThunk("auth/loginUser", async (data, thunkAPI) => {
	try {
		const payload = await authApi.login(data);
		if (payload?.success === false) {
			return thunkAPI.rejectWithValue(payload?.message ?? "Login failed");
		}
		return payload?.data?.user ?? payload?.data ?? payload;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Login failed");
	}
});

export const registerUser = createAsyncThunk("auth/registerUser", async (data, thunkAPI) => {
	try {
		const payload = await authApi.register(data);
		if (payload?.success === false) {
			return thunkAPI.rejectWithValue(payload?.message ?? "Registration failed");
		}
		return payload?.data?.user ?? payload?.data ?? payload;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
	}
});

export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
	const authBase = (import.meta.env.VITE_AUTH_SERVICE_URL || "").replace(/\/+$/, "");
	window.location.assign(`${authBase}/api/auth/google`);
	return true;
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, thunkAPI) => {
	try {
		const payload = await authApi.getProfile();
		if (payload?.success === false) {
			return thunkAPI.rejectWithValue(payload?.message ?? "Failed to fetch current user");
		}
		return payload?.data?.user ?? payload?.data ?? payload;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch current user");
	}
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
	try {
		const payload = await authApi.logout();
		if (payload?.success === false) {
			return thunkAPI.rejectWithValue(payload?.message ?? "Logout failed");
		}
		return true;
	} catch (error) {
		return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Logout failed");
	}
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async () => {
	const payload = await authApi.getProfile();
	return payload?.data?.user ?? payload?.data ?? payload;
});

export const updateUserProfile = createAsyncThunk(
	"auth/updateUserProfile",
	async ({ firstName, lastName }, thunkAPI) => {
		try {
			const payload = await authApi.updateProfile({ firstName, lastName });
			if (payload?.success === false) {
				return thunkAPI.rejectWithValue(payload?.message ?? "Failed to update profile");
			}
			return payload?.data?.user ?? payload?.user ?? null;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Failed to update profile");
		}
	},
);

const initialState = {
	user: null,
	authenticated: false,
	isAuthenticated: false,
	initializing: true,
	loading: false,
	error: null,
};

const setAuthenticatedUser = (state, payload) => {
	state.user = payload?.user ?? payload ?? null;
	state.authenticated = Boolean(state.user);
	state.isAuthenticated = Boolean(state.user);
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser(state, action) {
			setAuthenticatedUser(state, action.payload);
			state.initializing = false;
		},
		clearUser(state) {
			state.user = null;
			state.authenticated = false;
			state.isAuthenticated = false;
			state.initializing = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				setAuthenticatedUser(state, action.payload);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? action.error?.message ?? null;
			})
			.addCase(registerUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false;
				setAuthenticatedUser(state, action.payload);
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? action.error?.message ?? null;
			})
			.addCase(googleLogin.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(googleLogin.fulfilled, (state, action) => {
				state.loading = false;
				setAuthenticatedUser(state, action.payload);
			})
			.addCase(googleLogin.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? action.error?.message ?? null;
			})
			.addCase(fetchCurrentUser.pending, (state) => {
				state.initializing = true;
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.initializing = false;
				state.loading = false;
				setAuthenticatedUser(state, action.payload);
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.initializing = false;
				state.loading = false;
				state.error = action.payload ?? action.error?.message ?? null;
			})
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.user = null;
				state.authenticated = false;
				state.isAuthenticated = false;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? action.error?.message ?? null;
			})
			.addCase(fetchProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchProfile.fulfilled, (state, action) => {
				state.loading = false;
				setAuthenticatedUser(state, action.payload);
			})
			.addCase(fetchProfile.rejected, (state) => {
				state.loading = false;
			})
			.addCase(updateUserProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateUserProfile.fulfilled, (state, action) => {
				state.loading = false;
				if (action.payload) {
					setAuthenticatedUser(state, action.payload);
				} else {
					state.error = "Profile update returned no user data";
				}
			})
			.addCase(updateUserProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload ?? action.error?.message ?? null;
			});
	},
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
