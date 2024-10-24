import Link from "next/link";
import Image from "next/image";
import { TTodo } from "@/app/types/types";
import emptyTodo from "../../../public/image/empty_todo.png";
import emptyDone from "../../../public/image/empty_done.png";
import TodoToggleButton from "./TodoToggleButton";

interface TodoListItemProps {
  todos: TTodo[];
  toggleTodoHandler: (id: string) => void;
  listName: "todo" | "done";
  loadingStatus: boolean;
}

const TodoListItem: React.FC<TodoListItemProps> = ({
  todos,
  toggleTodoHandler,
  listName,
  loadingStatus,
}) => {
  return (
    <>
      {loadingStatus ? (
        <div className="flex justify-center items-center">
          <div>Loading</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-3 ">
          {/* "TO DO" 목록에 출력되어야하는 경우 */}
          {listName === "todo" ? (
            <>
              {/* todo 중 진행중인 todo가 있는지 여부 확인 */}
              {todos.filter((todo) => !todo.isCompleted).length > 0 ? (
                // 1개 이상 존재하는경우
                todos
                  .filter((todo) => !todo.isCompleted)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="w-full h-12 pl-4 flex flex-row rounded-full items-center justify-start gap-5 border-black border-2 bg-white"
                    >
                      {/* todo의 완료여부를 토글할 수 있는 버튼 컴포넌트 */}
                      <TodoToggleButton
                        todo={todo}
                        toggleTodoHandler={() => toggleTodoHandler(todo.id)}
                      />
                      {/* todo를 클릭시 todo 상세페이지로 이동 */}
                      <Link href={`/items/${todo.id}`}>
                        <span>{todo.name}</span>
                      </Link>
                    </div>
                  ))
              ) : (
                // 1개도 존재하지 않는 경우
                <div className="flex flex-col items-center font-bold text-slate-400">
                  <Image src={emptyTodo} alt="empty-todo" />
                  <span>할 일이 없어요.</span>
                  <span>TODO를 새롭게 추가해주세요!</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* "DONE" 목록에 출력되어야하는 경우 */}
              {todos.filter((todo) => todo.isCompleted).length > 0 ? (
                todos
                  .filter((todo) => todo.isCompleted)
                  .map((todo) => (
                    <div
                      key={todo.id}
                      className="w-full h-12 pl-4 flex flex-row rounded-full items-center justify-start gap-5 border-black border-2 bg-violet-100"
                    >
                      {/* todo의 완료여부를 토글할 수 있는 버튼 컴포넌트 */}
                      <TodoToggleButton
                        todo={todo}
                        toggleTodoHandler={() => toggleTodoHandler(todo.id)}
                      />
                      {/* todo를 클릭시 todo 상세페이지로 이동 */}
                      <Link href={`/items/${todo.id}`}>
                        <span className="line-through">{todo.name}</span>
                      </Link>
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default TodoListItem;
