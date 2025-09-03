import { useEffect, useRef, useState } from "react";
import TaskItem from "./TaskItem.jsx";
import "./TaskList.css";

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  filter,
}) {
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const filtered = tasks.filter((t) => {
    if (filter === "done") return !!t.completed;
    if (filter === "open") return !t.completed;
    return true;
  });

  const looped = [...filtered, ...filtered, ...filtered];

  useEffect(() => {
    // If no tasks, don't start the animation
    if (filtered.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    let animationId;
    let startTime = Date.now();
    const duration = 10000; // 10K milliseconds for full rotation

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;

      if (!isHovered) {
        track.style.transform = `translateX(-${progress * 100}%)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [filtered, isHovered]);

  // If no tasks, show message
  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div
      className="task-list-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-container">
        <div ref={trackRef} className="track">
          {looped.map((task, idx) => (
            <TaskItem
              key={`${task.id}-${idx}`}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
