
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todo-tasks")) || [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    const title = input.trim();
    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        completed: false,
      },
    ]);

    setInput("");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remaining = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <main className="app">
      <section className="todo-card">
        <header className="header">
          <p className="eyebrow">YOUR DAILY PLANNER</p>
          <h1>My To-Do List</h1>
          <p className="subtitle">
            Small steps make big progress.
          </p>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What do you need to do?"
            aria-label="New task"
            maxLength={200}
          />
          <button type="submit">Add task</button>
        </form>

        <div className="task-toolbar">
          <span>{remaining} tasks remaining</span>

          <div className="filters">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "selected" : ""}
                onClick={() => setFilter(item)}
              >
                {item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li className="task-item" key={task.id}>
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span
                  className={
                    task.completed ? "task-title completed" : "task-title"
                  }
                >
                  {task.title}
                </span>
              </label>

              <button
                type="button"
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p className="empty-state">
            {tasks.length === 0
              ? "No tasks yet. Add your first task above!"
              : "No tasks match this filter."}
          </p>
        )}

        <footer className="footer">
          You have got this. One task at a time!
        </footer>
      </section>
    </main>
  );
}

export default App;
