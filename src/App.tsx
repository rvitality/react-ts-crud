import React, { useEffect, useState } from "react";

import Item from "./components/Item.component";
import "./App.scss";

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const App: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    console.log(todos[0]);

    const [updateItemId, setUpdateItemId] = useState<number>();
    const [title, setTitle] = useState<string>("");
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            try {
                const parsedTodos = JSON.parse(storedTodos);

                if (parsedTodos.length > 0) {
                    setTodos(parsedTodos);
                }
            } catch (error) {
                console.error("Error parsing todos from local storage", error);
            }
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("todos", JSON.stringify(todos));
        } catch (error) {
            console.error("Error setting todos in local storage", error);
        }
    }, [todos]);

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!title.trim()) return;

        //  add new item
        if (!isEditing) {
            const newTodo: Todo = {
                id: Math.random(),
                title,
                completed: isCompleted,
            };

            setTodos(prevState => [...prevState, newTodo]);
        } else {
            if (updateItemId !== undefined) {
                const updateItem = {
                    id: updateItemId,
                    title,
                    completed: isCompleted,
                };

                setTodos(prevState =>
                    prevState.map(todo => (todo.id === updateItemId ? updateItem : todo))
                );
            }
        }

        setTitle("");
        setIsCompleted(false);
        setIsEditing(false);
        setUpdateItemId(undefined);
    };

    const cancelEditHandler = () => {
        setIsEditing(false);
        setTitle("");
        setIsCompleted(false);
    };

    const toggleCheck = (itemId: number) => {
        setTodos(prevState =>
            prevState.map(todo => {
                if (todo.id === itemId) {
                    return { ...todo, completed: !todo.completed };
                }

                return todo;
            })
        );
    };

    const updateHandler = (item: Todo) => {
        setIsEditing(true);

        const { id, title, completed } = item;

        setTitle(title);
        setIsCompleted(completed);
        setUpdateItemId(id);
    };

    const deleteHandler = (itemId: number) => {
        setTodos(prevState => prevState.filter(todo => todo.id !== itemId));
    };

    return (
        <main className="app">
            <div className="cover"></div>
            <div className="container">
                <h1>To-Do</h1>

                <form action="" className="form" onSubmit={submitHandler}>
                    <input
                        type="checkbox"
                        name="status"
                        checked={isCompleted}
                        onChange={e => setIsCompleted(e.target.checked)}
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Type something..."
                        className="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />

                    <div className="actions">
                        <button type="submit">{!isEditing ? "➕" : "✅"}</button>
                        {isEditing && <button onClick={cancelEditHandler}>🚫</button>}
                    </div>
                </form>

                <div>
                    <ul className="list">
                        {todos.length > 0 &&
                            todos.map(item => (
                                <Item
                                    key={item.id}
                                    onToggleCheck={() => toggleCheck(item.id)}
                                    onUpdate={() => updateHandler(item)}
                                    onDelete={() => deleteHandler(item.id)}
                                    item={item}
                                />
                            ))}
                    </ul>
                </div>
            </div>
        </main>
    );
};

export default App;
