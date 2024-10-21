"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import checkButtonTrue from "../../public/assets/image/check-button-true.png";
import checkButtonFalse from "../../public/assets/image/check-button-false.png";
import emptyTodo from "../../public/assets/image/empty_todo.png";
import emptyDone from "../../public/assets/image/empty_done.png";
import { TTodo } from "@/app/types/types";
import api from "@/app/api/api";

const TodoList = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await api.get(`/items`);
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  const addTodoHandler = async () => {
    if (!newTodo.trim()) return;

    const response = await api.post(`/items`, {
      name: newTodo,
    });

    setTodos([...todos, response.data]);
    setNewTodo("");
  };

  const toggleTodoHandler = async (id: string) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    const updatedIsCompleted = !targetTodo.isCompleted;

    await api.patch(`/items/${id}`, {
      isCompleted: !targetTodo.isCompleted,
    });

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: updatedIsCompleted } : todo
      )
    );
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center px-4 md:px-16 lg:px-72 mt-12">
        {/* INPUT AREA */}
        <div className="flex flex-col md:flex-col lg:flex-row justify-center w-full h-14">
          <input
            type="text"
            placeholder="할 일을 입력해주세요"
            className="w-full md:w-3/4 h-full pl-8 border-2 bg-slate-100 border-black rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)] font-bold"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            className="w-full md:w-1/4 h-full mt-4 md:mt-0 md:ml-8 border-2 bg-slate-100 border-black rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)] shadow-lg font-bold"
            onClick={() => addTodoHandler()}
          >
            + 추가하기
          </button>
        </div>

        {/* LIST AREA */}
        <div className="flex flex-col md:flex-row w-full mt-12 gap-8">
          {/* TODO LIST AREA */}
          <div className="w-full md:w-1/2">
            <div className="w-24 h-9 text-center leading-9 bg-lime-300 text-green-700 font-bold text-lg rounded-full">
              TO DO
            </div>
            <div className="flex flex-col gap-4 mt-3 ">
              {todos.filter((todo) => !todo.isCompleted).length > 0 ? (
                todos
                  .filter((todo) => !todo.isCompleted)
                  .map((todo) => (
                    <Link key={todo.id} href={`/items/${todo.id}`}>
                      <div
                        key={todo.id}
                        className="w-full h-12 pl-4 flex flex-row rounded-full items-center justify-start gap-5 border-black border-2 bg-white"
                      >
                        <Image
                          src={
                            todo.isCompleted
                              ? checkButtonTrue
                              : checkButtonFalse
                          }
                          alt={
                            todo.isCompleted
                              ? "check-button-true"
                              : "check-button-false"
                          }
                          className="w-8 h-8 cursor-pointer"
                          onClick={() => toggleTodoHandler(todo.id)}
                        />
                        {todo.name}
                      </div>
                    </Link>
                  ))
              ) : (
                <>
                  <div className="flex flex-col items-center font-bold text-slate-400">
                    <Image src={emptyTodo} alt="empty-todo" />
                    <span>할 일이 없어요.</span>
                    <span>TODO를 새롭게 추가해주세요!</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DONE LIST AREA */}
          <div className="w-full md:w-1/2">
            <div className="w-24 h-9 text-center leading-9 bg-green-700 text-amber-300 font-bold text-lg rounded-full">
              DONE
            </div>
            <div className="flex flex-col gap-4 mt-3 ">
              {todos.filter((todo) => todo.isCompleted).length > 0 ? (
                todos
                  .filter((todo) => todo.isCompleted)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="w-full h-12 pl-4 flex flex-row rounded-full items-center justify-start gap-5 border-black border-2 bg-violet-100"
                    >
                      <Image
                        src={
                          todo.isCompleted ? checkButtonTrue : checkButtonFalse
                        }
                        alt={
                          todo.isCompleted
                            ? "check-button-true"
                            : "check-button-false"
                        }
                        className="w-8 h-8 cursor-pointer"
                        onClick={() => toggleTodoHandler(todo.id)}
                      />
                      <span className="line-through">{todo.name}</span>
                    </div>
                  ))
              ) : (
                <>
                  <div className="flex flex-col items-center font-bold text-slate-400">
                    <Image src={emptyDone} alt="empty-done" />
                    <span>아직 다 한 일이 없어요.</span>
                    <span>해야 할 일을 체크해보세요!</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TodoList;
