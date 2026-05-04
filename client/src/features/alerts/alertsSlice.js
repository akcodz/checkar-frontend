import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as notificationsApi from "../../api/notifications";

export const fetchAlerts = createAsyncThunk("alerts/fetchAlerts", async () => {
	const payload = await notificationsApi.getNotifications();
	return payload?.data ?? payload?.notifications ?? payload ?? [];
});

export const markAlertRead = createAsyncThunk("alerts/markAlertRead", async (id) => {
	await notificationsApi.markNotificationRead(id);
	return id;
});

const initialState = {
	alerts: [],
	unreadCount: 0,
	loading: false,
	error: null,
};

const alertsSlice = createSlice({
	name: "alerts",
	initialState,
	reducers: {
		markAllRead(state) {
			state.alerts = state.alerts.map((a) => ({ ...a, isRead: true }));
			state.unreadCount = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAlerts.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAlerts.fulfilled, (state, action) => {
				state.loading = false;
				state.alerts = action.payload;
				state.unreadCount = action.payload.filter((a) => !a.isRead).length;
			})
			.addCase(fetchAlerts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			.addCase(markAlertRead.fulfilled, (state, action) => {
				const id = action.payload;
				state.alerts = state.alerts.map((a) => (a._id === id ? { ...a, isRead: true } : a));
				state.unreadCount = state.alerts.filter((a) => !a.isRead).length;
			});
	},
});

export const { markAllRead } = alertsSlice.actions;
export default alertsSlice.reducer;
