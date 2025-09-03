import { useState } from "react";
import "./TaskItem.css";

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <div className="task-texts">
          <div className={`task-title ${task.completed ? "done" : ""}`}>
            {task.title}
          </div>
          <div className={`priority-tag ${task.priority || "medium"}`}>
            {task.priority || "medium"}
          </div>
          {task.description ? (
            <div className="task-desc">{task.description}</div>
          ) : null}
          <div className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button
          className="btn-edit"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          Edit
        </button>
        {showDeleteConfirm ? (
          <div className="delete-confirm">
            <span>Sure?</span>
            <button className="btn-delete-confirm" onClick={handleDelete}>
              Yes
            </button>
            <button className="btn-cancel" onClick={cancelDelete}>
              No
            </button>
          </div>
        ) : (
          <button
            className="btn-delete"
            onClick={handleDelete}
            title="Delete task"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
