import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	sidebarOpen: false,
	activeModal: null,
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		toggleSidebar(state) {
			state.sidebarOpen = !state.sidebarOpen;
		},
		setSidebarOpen(state, action) {
			state.sidebarOpen = action.payload;
		},
		setActiveModal(state, action) {
			state.activeModal = action.payload;
		},
	},
});

export const { toggleSidebar, setSidebarOpen, setActiveModal } = uiSlice.actions;
export default uiSlice.reducer;
