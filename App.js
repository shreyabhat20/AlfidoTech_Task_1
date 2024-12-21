// Import necessary libraries
import React, { useState } from 'react';
import './App.css'; // Assuming you will style here

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState(['Work', 'Family', 'Personal']);
    const [filter, setFilter] = useState('All');
    const [sortOption, setSortOption] = useState('recentlyAdded');

    const addTodo = (todo) => {
        setTodos([...todos, { ...todo, id: Date.now(), completed: false, createdAt: new Date(), updatedAt: new Date() }]);
    };

    const updateTodo = (id, updatedFields) => {
        setTodos(
            todos.map((todo) => (todo.id === id ? { ...todo, ...updatedFields, updatedAt: new Date() } : todo))
        );
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const toggleStarred = (id) => {
        updateTodo(id, { starred: !todos.find((todo) => todo.id === id).starred });
    };

    const toggleCompleted = (id) => {
        updateTodo(id, { completed: !todos.find((todo) => todo.id === id).completed });
    };

    const filteredTodos = () => {
        let filtered = todos;
        if (filter === 'starred') {
            filtered = todos.filter((todo) => todo.starred);
        } else if (filter === 'completed') {
            filtered = todos.filter((todo) => todo.completed);
        } else if (filter === 'recentlyAdded') {
            filtered = [...todos].sort((a, b) => b.createdAt - a.createdAt);
        } else if (filter === 'recentlyEdited') {
            filtered = [...todos].sort((a, b) => b.updatedAt - a.updatedAt);
        } else if (categories.includes(filter)) {
            filtered = todos.filter((todo) => todo.category === filter);
        }
        return filtered;
    };

    const sortedTodos = () => {
        const sorted = [...filteredTodos()];
        if (sortOption === 'importance') {
            sorted.sort((a, b) => b.importance - a.importance);
        }
        return sorted;
    };

    return (
        <div className="todo-app">
            <aside className="side-menu">
                <h2>Filters</h2>
                <button onClick={() => setFilter('All')}>All</button>
                <button onClick={() => setFilter('starred')}>Starred</button>
                <button onClick={() => setFilter('completed')}>Completed</button>
                <button onClick={() => setFilter('recentlyAdded')}>Recently Added</button>
                <button onClick={() => setFilter('recentlyEdited')}>Recently Edited</button>
                {categories.map((category) => (
                    <button key={category} onClick={() => setFilter(category)}>{category}</button>
                ))}
            </aside>

            <main>
                <h1>Todo List</h1>
                <TodoForm categories={categories} onAddTodo={addTodo} />
                <TodoList
                    todos={sortedTodos()}
                    onUpdateTodo={updateTodo}
                    onDeleteTodo={deleteTodo}
                    onToggleStarred={toggleStarred}
                    onToggleCompleted={toggleCompleted}
                />
            </main>
        </div>
    );
};

const TodoForm = ({ categories, onAddTodo }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [importance, setImportance] = useState(1);
    const [targetDate, setTargetDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTodo({ text, category, importance, targetDate });
        setText('');
        setImportance(1);
        setTargetDate('');
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Add a new task"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <input
                type="range"
                min="1"
                max="5"
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
            />
            <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

const TodoList = ({ todos, onUpdateTodo, onDeleteTodo, onToggleStarred, onToggleCompleted }) => (
    <ul className="todo-list">
        {todos.map((todo) => (
            <li key={todo.id} className={`todo-item importance-${todo.importance}`}>
                <div>
                    <h3>{todo.text}</h3>
                    <p>Category: {todo.category}</p>
                    <p>Target Date: {todo.targetDate || 'None'}</p>
                    <p>Importance: {todo.importance}</p>
                </div>
                <button onClick={() => onToggleStarred(todo.id)}>
                    {todo.starred ? 'Unstar' : 'Star'}
                </button>
                <button onClick={() => onToggleCompleted(todo.id)}>
                    {todo.completed ? 'Unmark' : 'Complete'}
                </button>
                <button onClick={() => onDeleteTodo(todo.id)}>Delete</button>
            </li>
        ))}
    </ul>
);

export default TodoApp;
