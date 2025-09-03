import { useEffect, useMemo, useState } from "react";
import "./App.css";
import TaskList from "./components/TaskList.jsx";
import TaskItem from "./components/TaskItem.jsx";
import TaskForm from "./components/TaskForm.jsx";
import TaskFilter from "./components/TaskFilter.jsx";
import {
  fetchTasks,
  fetchAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "./api/index.js";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loadedPages, setLoadedPages] = useState(new Set([1]));

  useEffect(() => {
    loadInitialTasks();
  }, []);

  const loadInitialTasks = async () => {
    setLoading(true);
    setError("");
    try {
      // טען את כל המשימות בטעינה הראשונה
      const data = await fetchAllTasks();
      setTasks(data.tasks || []);

      // עדכן את ה-pagination בהתאם
      const totalTasks = data.tasks?.length || 0;
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(totalTasks / 3),
        totalTasks,
        hasNextPage: totalTasks > 3,
        hasPrevPage: false,
      });
    } catch (e) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      const created = await createTask(payload);
      setTasks((prev) => [...prev, created]);

      // עדכן את ה-pagination אחרי יצירת משימה חדשה
      setPagination((prev) => ({
        ...prev,
        totalTasks: prev.totalTasks + 1,
        totalPages: Math.ceil((prev.totalTasks + 1) / 3),
      }));

      setEditing(null);
    } catch (e) {
      setError("Failed to create task");
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
    } catch (e) {
      setError("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));

      // עדכן את ה-pagination אחרי מחיקת משימה
      setPagination((prev) => ({
        ...prev,
        totalTasks: Math.max(0, prev.totalTasks - 1),
        totalPages: Math.ceil(Math.max(0, prev.totalTasks - 1) / 3),
      }));
    } catch (e) {
      setError("Failed to delete task");
    }
  };

  const handleToggle = async (id) => {
    try {
      const toggled = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === toggled.id ? toggled : t)));
    } catch (e) {
      setError("Failed to toggle task");
    }
  };

  const loadMoreTasks = async (page) => {
    if (loadedPages.has(page)) return; // כבר טענו את הדף הזה

    try {
      const data = await fetchTasks(page, 3);
      setTasks((prev) => [...prev, ...data.tasks]);
      setPagination(data.pagination);
      setLoadedPages((prev) => new Set([...prev, page]));
    } catch (e) {
      console.error("Failed to load more tasks:", e);
    }
  };

  const onSubmit = (payload) => {
    if (editing) return handleUpdate(editing.id, payload);
    return handleCreate(payload);
  };

  return (
    <div className="app">
      <h1>My tasks</h1>
      <div className="tasks-container">
        <TaskFilter filter={filter} onChange={setFilter} />

        <TaskForm
          initialTask={editing}
          onSubmit={onSubmit}
          onCancel={() => setEditing(null)}
        />

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggle={handleToggle}
            onEdit={setEditing}
            onDelete={handleDelete}
            onLoadMore={loadMoreTasks}
            pagination={pagination}
          />
        )}
      </div>
    </div>
  );
}

export default App;
