import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as incidentsApi from "../../api/incidents";

export const fetchIncidents = createAsyncThunk("incidents/fetchIncidents", async () => {
	const payload = await incidentsApi.getIncidents();
	return payload?.data ?? payload?.incidents ?? payload ?? [];
});

export const fetchIncidentById = createAsyncThunk("incidents/fetchIncidentById", async (id) => {
	const payload = await incidentsApi.getIncidentById(id);
	return payload?.data ?? payload;
});

const initialState = {
	incidents: [],
	activeIncident: null,
	loading: false,
	error: null,
};

const incidentsSlice = createSlice({
	name: "incidents",
	initialState,
	reducers: {
		clearActiveIncident(state) {
			state.activeIncident = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchIncidents.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchIncidents.fulfilled, (state, action) => {
				state.loading = false;
				state.incidents = action.payload;
			})
			.addCase(fetchIncidents.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			.addCase(fetchIncidentById.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchIncidentById.fulfilled, (state, action) => {
				state.loading = false;
				state.activeIncident = action.payload;
			})
			.addCase(fetchIncidentById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			});
	},
});

export const { clearActiveIncident } = incidentsSlice.actions;
export default incidentsSlice.reducer;
