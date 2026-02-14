import { configureStore } from "@reduxjs/toolkit";
import countdownReducer from "./countdownSlice";

export const store = configureStore({
    reducer: {
        countdowns: countdownReducer,
    },
});
