"use client";

import { useEffect, useState } from "react";
import { TTodo } from "@/app/types/types";
import api from "@/app/api/api";
import TodoListItem from "@/app/components/TodoListItem";
import TodoListTitle from "@/app/components/TodoListTitle";

const TodoList = () => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  // 페이지 렌더링시 todo 정보를 가져오는 핸들러
  useEffect(() => {
    setLoading(true);
    const fetchTodos = async () => {
      const response = await api.get(`/items`);
      // 받은 데이터는 setTodos를 통해 상태관리
      setTodos(response.data);
    };

    fetchTodos();
    setLoading(false);
  }, []);

  // "추가하기" 버튼 클릭시 todo 등록하는 핸들러
  const addTodoHandler = async () => {
    // 공백제외 내용이 없으면 동작안함
    if (!newTodo.trim()) return;
    // 입력한 내용은 newTodo로 상태관리 되니 그 값만 담아서 post요청보냄
    const response = await api.post(`/items`, {
      name: newTodo,
    });

    // 변경사항을 todos에 반영함
    setTodos([...todos, response.data]);
    // 입력창을 비움
    setNewTodo("");
  };

  // todo 토글버튼 클릭시 todo의 출력위치 및 토글버튼의 이미지를 바꾸는 핸들러
  const toggleTodoHandler = async (id: string) => {
    // 파라미터로 전달된 id를 가지는 todo가 존재하는지 학인하고
    // 없으면 동작안함
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    // 해당 todo의 isCompleted 값을 바꾸고 변수에 할당
    const toggledTodoStatus = !targetTodo.isCompleted;
    // 변경사항이 적용된 todo의 정보를 담아 patch요청으로 보냄
    await api.patch(`/items/${id}`, {
      isCompleted: toggledTodoStatus,
    });

    // todos에도 변경사항 적용
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: toggledTodoStatus } : todo
      )
    );
  };

  return (
    <>
      <div className="flex-1 flex flex-col items-center px-4 md:px-16 lg:px-72 mt-12">
        {/* 입력 파트 */}
        <div className="flex flex-col md:flex-col lg:flex-row justify-center w-full h-14">
          {/* 사용자 입력필드 */}
          <input
            type="text"
            placeholder="할 일을 입력해주세요"
            className="w-full md:w-3/4 h-full pl-8 border-2 bg-slate-100 border-black rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)] font-bold"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            // Enter키가 입력되고 입력필드에 입력된 값이 존재한다면 todo를 추가하는 핸들러를 실행
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTodo.trim().length > 0) {
                console.log(e);
                addTodoHandler();
              }
            }}
          />
          {/* 추가하기 버튼 */}
          <button
            className="w-full md:w-1/4 h-full mt-4 md:mt-0 md:ml-8 border-2 bg-slate-100 border-black rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)] shadow-lg font-bold"
            onClick={addTodoHandler}
          >
            + 추가하기
          </button>
        </div>

        {/* 목록 파트 */}
        <div className="flex flex-col md:flex-row w-full mt-12 gap-8">
          {/* 진행중인 todo 목록 */}
          <div className="w-full md:w-1/2">
            <TodoListTitle
              titleName="TO DO"
              bgColor="bg-lime-300"
              textColor="text-green-700"
            />
            {/* todo 요소 컴포넌트 */}
            <TodoListItem
              todos={todos}
              toggleTodoHandler={toggleTodoHandler}
              listName="todo"
              loadingStatus={loading}
            />
          </div>

          {/* 완료된 todo 목록 */}
          <div className="w-full md:w-1/2">
            <TodoListTitle
              titleName="TO DO"
              bgColor="bg-green-700"
              textColor="text-amber-300"
            />
            {/* todo 요소 컴포넌트 */}
            <TodoListItem
              todos={todos}
              toggleTodoHandler={toggleTodoHandler}
              listName="done"
              loadingStatus={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default TodoList;
