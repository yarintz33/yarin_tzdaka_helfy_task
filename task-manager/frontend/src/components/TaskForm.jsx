import { useEffect, useState } from "react";
import "../css/TaskForm.css";

export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(initialTask?.title || "");
    setDescription(initialTask?.description || "");
    setPriority(initialTask?.priority || "medium");
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      // נקה את הטופס רק אם זה לא עריכה
      if (!initialTask) {
        setTitle("");
        setDescription("");
        setPriority("medium");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          placeholder="Task title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting}
          placeholder="Priority"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      <div className="form-row">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows="2"
        />
      </div>
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="btn-primary"
        >
          {isSubmitting ? "..." : initialTask ? "Update Task" : "Add Task"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="btn-secondary"
        >
          {initialTask ? "Cancel" : "Clear"}
        </button>
      </div>
    </form>
  );
}
