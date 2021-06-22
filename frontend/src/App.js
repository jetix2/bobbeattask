import React, { useState, useEffect } from "react";
import "./App.css";
import api from "./api.js";
import { RiCloseCircleLine } from "react-icons/ri";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await api.getAllTodos();
      setTodos(todos);
    };
    fetchTodoAndSetTodos();
  }, []);

  const createTodo = async (e) => {
    e.preventDefault();
    if (!todo) {
      alert("please enter something");
      return;
    }
    if (todos.some(({ task }) => task === todo)) {
      alert(`Task: ${todo} already exists`);
      return;
    }
    const newTodo = await api.createTodo(todo);
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      await api.deleteTodo(id);
      setTodos(todos.filter(({ _id: i }) => id !== i));
    } catch (err) {}
  };

  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const payload = {
      completed: !todos.find((todo) => todo._id === id).completed,
    };
    const updatedTodo = await api.updateTodo(id, payload);
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
  };

  return (
    <div>
      <div className="brand">
        <h1>
          <span className="round">BobBeat</span>
        </h1>
      </div>
      <div className="todo-app">
        <div className="">
          <h1>What is the plan for today ?</h1>
          <input
            type="text"
            value={todo}
            onChange={({ target }) => setTodo(target.value)}
            placeholder="Enter a todo"
            className="todo-input"
          />
          <button className="todo-button" type="button" onClick={createTodo}>
            Add
          </button>
        </div>

        <div className="">
          {todos.length ? (
            todos.map(({ _id, task, completed }, i) => (
              <div
                className=""
                key={i}
                onClick={(e) => updateTodo(e, _id)}
                className={completed ? "completed" : ""}
              >
                {task}{" "}
                <button
                  onClick={(e) => deleteTodo(e, _id)}
                  className="delete-icon button"
                >
                  <RiCloseCircleLine />
                </button>
              </div>
            ))
          ) : (
            <p>
              <br />
              No Tasks
            </p>
          )}
        </div>
      </div>
      <footer className="footer">All right reserved Orel Malki 2021©</footer>
    </div>
  );
}

export default App;
