interface TodoListTitleProps {
  titleName: string;
  bgColor: string;
  textColor: string;
}

const TodoListTitle: React.FC<TodoListTitleProps> = ({
  titleName,
  bgColor,
  textColor,
}) => {
  return (
    <>
      <div
        className={`w-24 h-9 text-center leading-9 font-bold text-lg rounded-full ${bgColor} ${textColor}`}
      >
        {titleName}
      </div>
    </>
  );
};
export default TodoListTitle;
