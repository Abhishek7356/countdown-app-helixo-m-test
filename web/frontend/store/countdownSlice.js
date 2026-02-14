import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCountdowns = createAsyncThunk(
    "countdowns/fetchCountdowns",
    async ({ page, filters }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: page || 1,
                limit: 5,
                query: filters.query || "",
            });

            if (filters.status?.length) {
                params.append("status", filters.status[0]);
            }

            const res = await fetch(`/api/countdown/list?${params}`);
            const data = await res.json();

            if (!data.success) return rejectWithValue("Failed to fetch countdowns");

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCountdown = createAsyncThunk(
    "countdowns/createCountdown",
    async (form, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/countdown/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!data.success) return rejectWithValue(data.message || "Error");
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateCountdown = createAsyncThunk(
    "countdowns/updateCountdown",
    async ({ id, form }, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/countdown/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!data.success) return rejectWithValue(data.message || "Error");
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteCountdown = createAsyncThunk(
    "countdowns/deleteCountdown",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`/api/countdown/delete/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!data.success) return rejectWithValue(data.message || "Error");
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const countdownSlice = createSlice({
    name: "countdowns",
    initialState: {
        timers: [],
        pagination: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCountdowns.pending, (state) => { state.loading = true; state.error = null })
            .addCase(fetchCountdowns.fulfilled, (state, action) => {
                state.loading = false;
                state.timers = action.payload.items || [];
                state.pagination = action.payload.pagination || {};
            })
            .addCase(fetchCountdowns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createCountdown.pending, (state) => { state.loading = true; state.error = null })
            .addCase(createCountdown.fulfilled, (state) => { state.loading = false })
            .addCase(createCountdown.rejected, (state, action) => { state.loading = false; state.error = action.payload })

            .addCase(updateCountdown.pending, (state) => { state.loading = true; state.error = null })
            .addCase(updateCountdown.fulfilled, (state) => { state.loading = false })
            .addCase(updateCountdown.rejected, (state, action) => { state.loading = false; state.error = action.payload })

            .addCase(deleteCountdown.pending, (state) => { state.loading = true; state.error = null })
            .addCase(deleteCountdown.fulfilled, (state, action) => {
                state.loading = false;
                state.timers = state.timers.filter((t) => t._id !== action.payload);
            })
            .addCase(deleteCountdown.rejected, (state, action) => { state.loading = false; state.error = action.payload });
    },
});

export default countdownSlice.reducer;
