import React, { useState } from "react";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [todos, setTodos] = useState([]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <TodoForm onAddTodo={addTodo} />
          <TodoList todos={todos} />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
