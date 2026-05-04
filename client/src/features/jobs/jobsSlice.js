import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as jobsApi from "../../api/jobs";

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async ({ page = 1, limit = 20 } = {}) => {
	const res = await jobsApi.getJobs({ page, limit });
	const payload = res?.data ?? res;
	return {
		jobs: payload.jobs ?? [],
		pagination: {
			page: payload.page ?? page,
			total: payload.total ?? 0,
			totalPages: payload.totalPages ?? 1,
		},
	};
});

export const fetchJobById = createAsyncThunk("jobs/fetchJobById", async (id) => {
	const res = await jobsApi.getJobById(id);
	return res?.data ?? res;
});

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (id) => {
	await jobsApi.deleteJob(id);
	return id;
});

export const updateJob = createAsyncThunk("jobs/updateJob", async ({ id, data }) => {
	const res = await jobsApi.updateJob(id, data);
	return res?.data ?? res;
});

const initialState = {
	jobs: [],
	activeJob: null,
	pagination: { page: 1, total: 0, totalPages: 1 },
	loading: false,
	error: null,
};

const jobsSlice = createSlice({
	name: "jobs",
	initialState,
	reducers: {
		addJob(state, action) {
			state.jobs.unshift(action.payload);
			state.pagination.total += 1;
		},
		clearActiveJob(state) {
			state.activeJob = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchJobs.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchJobs.fulfilled, (state, action) => {
				state.loading = false;
				state.jobs = action.payload.jobs;
				state.pagination = action.payload.pagination;
			})
			.addCase(fetchJobs.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			.addCase(fetchJobById.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchJobById.fulfilled, (state, action) => {
				state.loading = false;
				state.activeJob = action.payload;
			})
			.addCase(fetchJobById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message ?? null;
			})
			.addCase(deleteJob.fulfilled, (state, action) => {
				state.jobs = state.jobs.filter((job) => job._id !== action.payload);
				if (state.activeJob?._id === action.payload) {
					state.activeJob = null;
				}
				state.pagination.total = Math.max(0, state.pagination.total - 1);
			})
			.addCase(updateJob.fulfilled, (state, action) => {
				const updated = action.payload;
				state.jobs = state.jobs.map((job) => (job._id === updated._id ? { ...job, ...updated } : job));
				if (state.activeJob?._id === updated._id) {
					state.activeJob = { ...state.activeJob, ...updated };
				}
			});
	},
});

export const { addJob, clearActiveJob } = jobsSlice.actions;
export default jobsSlice.reducer;
