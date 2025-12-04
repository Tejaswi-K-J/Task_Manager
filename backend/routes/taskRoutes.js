import express from "express";
import auth from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

/* ------------------------------
   CREATE TASK  (POST /tasks)
--------------------------------*/
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------
   GET TASKS  (GET /tasks)
   Supports: search, filter, sorting
--------------------------------*/
router.get("/", auth, async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = { userId: req.userId };

    if (status) query.status = status;

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------
   UPDATE TASK  (PUT /tasks/:id)
--------------------------------*/
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Only update fields that are provided
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------------------
   DELETE TASK  (DELETE /tasks/:id)
--------------------------------*/
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
