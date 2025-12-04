import axiosInstance from "./axiosInstance";

// CREATE
export const createTask = (data) => {
  return axiosInstance.post("/tasks", data);
};

// READ (with search + filter)
export const getTasks = (params = {}) => {
  return axiosInstance.get("/tasks", { params });
};

// UPDATE
export const updateTask = (id, data) => {
  return axiosInstance.put(`/tasks/${id}`, data);
};

// DELETE
export const deleteTask = (id) => {
  return axiosInstance.delete(`/tasks/${id}`);
};
