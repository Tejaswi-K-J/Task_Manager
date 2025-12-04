import { useState, useEffect } from "react";
import { createTask, getTasks, deleteTask, updateTask } from "../api/tasks.api";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // Form states for creating a task
  // ----------------------------------------------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  // Search + Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ----------------------------------------------------------
  // Task list state
  // ----------------------------------------------------------
  const [tasks, setTasks] = useState([]);

  // ----------------------------------------------------------
  // Inline edit states
  // ----------------------------------------------------------
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // ----------------------------------------------------------
  // Fetch tasks from backend
  // ----------------------------------------------------------
  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  // Load tasks on page mount
  useEffect(() => {
    loadTasks();
  }, []);

  // ----------------------------------------------------------
  // Handle task creation
  // ----------------------------------------------------------
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        setMessage({ type: "error", text: "Title is required" });
        setLoading(false);
        return;
      }

      await createTask({ title, description, status });

      setMessage({ type: "success", text: "Task created successfully!" });

      // Clear form fields
      setTitle("");
      setDescription("");
      setStatus("pending");

      loadTasks();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create task" });
      console.log("Create error:", error);
    }

    setLoading(false);
  };

  // ----------------------------------------------------------
  // Start editing a task
  // ----------------------------------------------------------
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
  };

  // ----------------------------------------------------------
  // Save edited task changes
  // ----------------------------------------------------------
  const saveEdit = async (id) => {
    try {
      await updateTask(id, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });

      setEditingId(null);
      loadTasks();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // ----------------------------------------------------------
  // Helper: Return color based on task status
  // ----------------------------------------------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400";
      case "in-progress":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      default:
        return "text-gray-300";
    }
  };

  // ----------------------------------------------------------
  // Filter tasks (search + status)
  // ----------------------------------------------------------
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) =>
      filterStatus === "all" ? true : task.status === filterStatus
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white px-5 py-10">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-center">Tasks</h1>

        {/* SUCCESS / ERROR MESSAGE */}
        {message && (
          <p
            className={`mb-4 text-center ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* CREATE TASK FORM */}
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4">

          {/* Task Title */}
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white outline-none"
          />

          {/* Task Description */}
          <textarea
            placeholder="Task Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white outline-none"
            rows="3"
          ></textarea>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-lg font-semibold disabled:bg-gray-600"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        {/* BACK TO DASHBOARD */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>

        {/* TASK LIST */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Your Tasks</h2>

        {/* SEARCH + STATUS FILTER */}
        <div className="flex gap-3 mb-6">

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white outline-none"
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 rounded bg-gray-700 text-white outline-none w-40"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

        </div>

        {/* NO TASKS FOUND */}
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center">No matching tasks</p>
        ) : (
          <div className="flex flex-col gap-4">

            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-700 p-4 rounded-lg shadow"
              >
                
                {/* CHECK EDIT MODE */}
                {editingId === task._id ? (
                  
                  <>
                    {/* EDIT MODE UI */}

                    {/* Edit Title */}
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 mb-2 rounded bg-gray-600"
                    />

                    {/* Edit Description */}
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-2 mb-2 rounded bg-gray-600"
                    ></textarea>

                    {/* Edit Status */}
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full p-2 mb-2 rounded bg-gray-600"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Save / Cancel */}
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => saveEdit(task._id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  
                  <>
                    {/* VIEW MODE UI */}
                    <h3 className="text-xl font-bold">{task.title}</h3>
                    <p className="text-gray-300 text-sm">{task.description}</p>

                    <p className={`mt-2 font-semibold ${getStatusColor(task.status)}`}>
                      {task.status.toUpperCase()}
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>

                    {/* EDIT + DELETE BUTTONS */}
                    <div className="flex gap-3 mt-3">

                      {/* Edit Button */}
                      <button
                        onClick={() => startEditing(task)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={async () => {
                          try {
                            await deleteTask(task._id);
                            loadTasks();
                          } catch (err) {
                            console.log("Delete error:", err);
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Tasks;
