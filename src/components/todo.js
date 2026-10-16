import React, { useState, useReducer, useRef } from "react";
import "./todo.css";
import { ACTIONS, initialState, reducer } from "./reducer";

function ToDo() {
  const [text, setText] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [editingId, setEditingId] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    if (editingId !== null) {
      dispatch({ type: ACTIONS.EDIT_TODO, payload: { id: editingId, text: value } });
      setEditingId(null);
    } else {
      dispatch({ type: ACTIONS.ADD_TODO, payload: value });
    }
    setText("");
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setText(todo.task);
    inputRef.current?.focus();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setText("");
  };

  const handleDone = (id) => {
    if (editingId === id) cancelEdit();
    setRemovingIds((ids) => [...ids, id]);
  };

  // Remove from state only after the exit animation finishes
  const handleAnimationEnd = (id) => {
    if (!removingIds.includes(id)) return;
    dispatch({ type: ACTIONS.DELETE_TODO, payload: id });
    setRemovingIds((ids) => ids.filter((x) => x !== id));
  };

  const remaining = state.length - removingIds.length;

  return (
    <div className="container">
      <main className="card">
        <header className="card-header">
          <h1>What's the Plan for Today?</h1>
          <p className="subtitle">
            {remaining === 0
              ? "Nothing on your list yet"
              : `${remaining} task${remaining === 1 ? "" : "s"} to go`}
          </p>
        </header>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="todo-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && editingId !== null && cancelEdit()}
            placeholder={editingId !== null ? "Update your task..." : "Add a new task..."}
            aria-label="Task"
          />
          <button className="btn btn-primary" type="submit" disabled={!text.trim()}>
            {editingId !== null ? "Update" : "Add"}
          </button>
          {editingId !== null && (
            <button className="btn btn-ghost" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>

        {state.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">📝</span>
            <p>Add your first task to get started.</p>
          </div>
        ) : (
          <ul className="todo-list">
            {state.map((todo) => (
              <li
                key={todo.id}
                className={[
                  "todo-item",
                  editingId === todo.id ? "is-editing" : "",
                  removingIds.includes(todo.id) ? "is-removing" : "",
                ].join(" ")}
                onAnimationEnd={() => handleAnimationEnd(todo.id)}
              >
                <span className="todo-text">{todo.task}</span>
                <div className="todo-actions">
                  <button
                    className="btn btn-icon btn-edit"
                    onClick={() => startEdit(todo)}
                    aria-label={`Edit "${todo.task}"`}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-icon btn-done"
                    onClick={() => handleDone(todo.id)}
                    aria-label={`Mark "${todo.task}" as done`}
                    title="Done"
                  >
                    ✓
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default ToDo;
