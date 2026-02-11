import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Severity = "success" | "error" | "info" | "warning";

interface NotificationState {
  open: boolean;
  message: string;
  severity: Severity;
}

const initialState: NotificationState = {
  open: false,
  message: "",
  severity: "success",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<{ message: string; severity: Severity }>) {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideNotification(state) {
      state.open = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
