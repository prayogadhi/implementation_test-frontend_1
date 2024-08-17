import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const toggleCompleted = async (id) => {
    try {
      const response = await api.put(`/todos/${id}/toggle`);
      const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: response.data.completed } : todo));
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling completed status:", error);
    }
  };

  const handleEdit = (id, title, description) => {
    setEditingId(id);
    setEditingTitle(title);
    setEditingDescription(description);
  };

  const handleBlur = useCallback(async () => {
    if (editingId !== null) {
      try {
        await api.put(`/todos/${editingId}`, {
          title: editingTitle,
          description: editingDescription,
        });
        const updatedTodos = todos.map((todo) => (todo.id === editingId ? { ...todo, title: editingTitle, description: editingDescription } : todo));
        setTodos(updatedTodos);
        setEditingId(null);
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  }, [editingId, editingTitle, editingDescription, todos]);

  const handleClickOutside = useCallback(
    (event) => {
      if (editInputRef.current && !editInputRef.current.contains(event.target)) {
        handleBlur();
      }
    },
    [handleBlur]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <div ref={editInputRef}>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={(e) => e.relatedTarget === null && handleBlur()}
                  onFocus={(e) => e.stopPropagation()}
                  autoFocus
                  placeholder="Edit title"
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  onBlur={(e) => e.relatedTarget === null && handleBlur()}
                  onFocus={(e) => e.stopPropagation()}
                  placeholder="Edit description"
                />
              </div>
            ) : (
              <div onClick={() => handleEdit(todo.id, todo.title, todo.description)}>
                <h2>{todo.title}</h2>
                <p>{todo.description}</p>
                {todo.completed ? "Completed" : "Pending"}
              </div>
            )}
            <button onClick={() => toggleCompleted(todo.id)}>{todo.completed ? "Mark as Incomplete" : "Mark as Complete"}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
