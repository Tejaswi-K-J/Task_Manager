import api from "./api";

export const getProfile = () => api.get("/profile/me");
export const updateProfile = (data) => api.put("/profile/update", data);
export const changePassword = (data) => api.put("/profile/change-password", data);
