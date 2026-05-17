import TaskItem from './TaskItem.jsx'

export default function TaskList({ tasks, onToggle, onDelete, onUpdateTask }) {
  if (tasks.length === 0) {
    return <div className="empty">No tasks yet — add one above.</div>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </ul>
  )
}
