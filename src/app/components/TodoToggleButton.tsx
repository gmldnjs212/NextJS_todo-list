import Image from "next/image";
import { TTodo } from "../types/types";
import checkButtonTrue from "../../../public/image/check-button-true.png";
import checkButtonFalse from "../../../public/image/check-button-false.png";

interface TodoToggleButtonProps {
  todo: TTodo;
  toggleTodoHandler: (id: string) => void;
}

const TodoToggleButton: React.FC<TodoToggleButtonProps> = ({
  todo,
  toggleTodoHandler,
}) => {
  return (
    <>
      <Image
        src={todo.isCompleted ? checkButtonTrue : checkButtonFalse}
        alt={todo.isCompleted ? "check-button-true" : "check-button-false"}
        className="w-8 h-8 cursor-pointer"
        onClick={() => toggleTodoHandler(todo.id)}
      />
    </>
  );
};
export default TodoToggleButton;
