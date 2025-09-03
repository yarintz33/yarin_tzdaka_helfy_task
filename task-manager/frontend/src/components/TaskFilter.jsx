import "../css/TaskFilter.css";

export default function TaskFilter({ filter, onChange }) {
  return (
    <div className="task-filter">
      <button
        className={filter === "all" ? "active" : ""}
        onClick={() => onChange("all")}
      >
        All
      </button>
      <button
        className={filter === "open" ? "active" : ""}
        onClick={() => onChange("open")}
      >
        Open
      </button>
      <button
        className={filter === "done" ? "active" : ""}
        onClick={() => onChange("done")}
      >
        Done
      </button>
    </div>
  );
}
