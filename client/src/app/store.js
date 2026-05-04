import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobsSlice";
// import logsReducer from "../features/logs/logsSlice";
import incidentsReducer from "../features/incidents/incidentsSlice";
import alertsReducer from "../features/alerts/alertsSlice";
import uiReducer from "../features/ui/uiSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		jobs: jobsReducer,
		// logs: logsReducer,
		incidents: incidentsReducer,
		alerts: alertsReducer,
		ui: uiReducer,
	},
});

export default store;
