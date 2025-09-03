import { useEffect, useRef, useState } from "react";
import TaskItem from "./TaskItem.jsx";
import "../css/TaskList.css";

export default function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  filter,
  onLoadMore,
  pagination,
}) {
  const trackRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filtered = tasks.filter((t) => {
    if (filter === "done") return !!t.completed;
    if (filter === "open") return !t.completed;
    return true;
  });

  const looped = [...filtered, ...filtered, ...filtered];

  const handleLoadMore = async () => {
    if (isLoadingMore || !pagination.hasNextPage) return;

    setIsLoadingMore(true);
    try {
      await onLoadMore(pagination.currentPage + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

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

        // Check if we need to load more tasks when approaching the end
        if (progress > 0.7 && pagination.hasNextPage && !isLoadingMore) {
          handleLoadMore();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [filtered, isHovered, pagination.hasNextPage, isLoadingMore]);

  // If no tasks, show message
  if (filtered.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="task-list-wrapper">
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

      {pagination.hasNextPage && (
        <div className="load-more-section">
          <button
            className="load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore
              ? "Loading..."
              : `Load More (${pagination.totalTasks - tasks.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
}
