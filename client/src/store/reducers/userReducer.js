import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: (window.localStorage.getItem("user") && window.localStorage.getItem("user") !== "undefined") ?
            JSON.parse(window.localStorage.getItem("user")) : {
                firstName: "",
                lastName: "",
                email: ""
            },
        premiumUser: window.localStorage.getItem("premiumUser") ?
            JSON.parse(window.localStorage.getItem("premiumUser")) : null,
        premiumMembership: window.localStorage.getItem("premiumMembership") ?
            JSON.parse(window.localStorage.getItem("premiumMembership")) : null,
        token: window.localStorage.getItem("token") ? window.localStorage.getItem("token") : "",
        loading: false,
        expandSidebar: false,
    },
    reducers: {
        createUser(state, action) {
            window.localStorage.setItem("user", JSON.stringify(action.payload.user));
            window.localStorage.setItem("token", action.payload.token);
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        updateUser(state, action) {
            window.localStorage.setItem("user", JSON.stringify(action.payload.user));
            window.localStorage.setItem("token", action.payload.token);
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        updateMembership(state, action) {
            let user = JSON.parse(window.localStorage.getItem("user"));
            user = { ...user, membership: action.payload };
            window.localStorage.setItem("user", JSON.stringify(user));
            state.user = user;
        },
        deleteUser(state, action) {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
            state.user = {
                firstName: "",
                lastName: "",
                email: ""
            };
            state.token = "";
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        updateSidebar(state, action) {
            state.expandSidebar = action.payload;
        }
    }
});

export const { createUser, updateUser, updateMembership, deleteUser, setLoading, updateSidebar, createPremiumInfo } = userSlice.actions;

export default userSlice.reducer;