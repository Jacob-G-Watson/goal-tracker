import type { User } from "@supabase/supabase-js";
import React from "react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/api";
import TodoItem from "../components/TodoItem";

export interface ITodo {
	is_complete: boolean;
	id: number;
	task: string;
}

export default function ToDos({ user }: { user: User }) {
	const [todos, setTodos] = useState<ITodo[]>([]);
	const newTaskTextRef = useRef<HTMLInputElement>(null);
	const [errorText, setError] = useState<string | null>("");

	useEffect(() => {
		fetchTodos().catch(console.error);
	}, []);

	const fetchTodos = async () => {
		let { data: todos, error } = await supabase.from("todos").select("*").order("id", { ascending: false });
		if (error) console.log("error fetch", error);
		else setTodos(todos as ITodo[]);
	};

	const deleteTodo = async (id: number) => {
		try {
			await supabase.from("todos").delete().eq("id", id);
			setTodos(todos.filter((x) => x.id !== id));
		} catch (error) {
			console.log("error delete", error);
		}
	};

	const addTodo = async () => {
		let taskText = newTaskTextRef.current!.value;
		let task = taskText.trim();
		if (task.length <= 3) {
			setError("Task length should be more than 3!");
		} else {
			let { data: todo, error } = await supabase.from("todos").insert({ task, user_id: user.id }).single();
			if (error) setError(error.message);
			else {
				setTodos([todo, ...todos]);
				setError(null);
				newTaskTextRef.current!.value = "";
			}
		}
	};

	return (
		<div>
			<div className={"flex flex-col flex-grow p-4"} style={{ height: "calc(100vh - 11.5rem)" }}>
				<div
					className={`p-2 border flex-grow grid gap-2 ${
						todos.length ? "auto-rows-min" : ""
					} grid-cols-1 h-2/3 overflow-y-scroll first:mt-8`}
				>
					{todos.length ? (
						todos.map((todo) => <TodoItem key={todo.id} todo={todo} onDelete={() => deleteTodo(todo.id)} />)
					) : (
						<span className={"h-full flex justify-center items-center"}>You do have any tasks yet!</span>
					)}
				</div>
				{!!errorText && (
					<div
						className={
							"border max-w-sm self-center px-4 py-2 mt-4 text-center text-sm bg-red-100 border-red-300 text-red-400"
						}
					>
						{errorText}
					</div>
				)}
			</div>
			<div className={"flex m-4 mt-0 h-10"}>
				<input
					ref={newTaskTextRef}
					type="text"
					onKeyUp={(e) => e.key === "Enter" && addTodo()}
					className={"bg-gray-200 border px-2 border-gray-300 w-full mr-4"}
				/>
				<button
					onClick={addTodo}
					className={
						"flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
					}
				>
					Add
				</button>
			</div>
		</div>
	);
}
