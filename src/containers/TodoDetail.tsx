"use client";

import { TTodo } from "@/app/types/types";
import { useRouter, useParams } from "next/navigation";
import { getTodoDetails, updateTodo, deleteTodo } from "../app/api/api";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import checkButtonTrue from "../../public/image/check-button-true.png";
import checkButtonFalse from "../../public/image/check-button-false.png";
import checkIcon from "../../public/image/check.png";
import XIcon from "../../public/image/X.png";
import imgIcon from "../../public/image/imgIcon.png";
import plusIcon from "../../public/image/plus.png";
import memoBg from "../../public/image/memo.png";

const TodoDetail = () => {
  const router = useRouter();
  const { itemId } = useParams();

  const [todo, setTodo] = useState<TTodo | null>(null);
  const [name, setName] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [loading, setLoading] = useState<boolean | null>(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [editStatus, setEditStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Todo 상세 정보 불러오기
  useEffect(() => {
    const fetchTodoDetails = async () => {
      console.log(router);

      if (!itemId || typeof itemId !== "string") return;

      try {
        const data = await getTodoDetails(itemId);
        setTodo(data);
        setName(data.name);
        setMemo(data.memo || "");
        setImageUrl(data.imageUrl || "");
      } catch (error) {
        console.error("[에러] fetching todo details failed :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetails();
  }, [itemId]);

  useEffect(() => {
    if (todo) {
      const nameCheck = todo.name !== name;
      const memoCheck = todo.memo !== memo;
      const imgCheck = todo.imageUrl !== imageUrl && imageUrl !== null;
      setEditStatus(nameCheck || memoCheck || imgCheck);
    }
  }, [name, memo, imageUrl]);

  // Todo 수정하기
  const handleUpdate = async () => {
    if (!itemId || typeof itemId !== "string") return;

    try {
      await updateTodo(itemId, { name, memo, imageUrl });
      alert("수정되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Todo 삭제하기
  const handleDelete = async () => {
    if (!itemId || typeof itemId !== "string") return;

    try {
      await deleteTodo(itemId);
      alert("삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[700px]">
        <p className="text-[50px] font-bold">Loading...</p>
      </div>
    );

  if (!todo)
    return (
      <div className="flex justify-center items-center min-h-[700px]">
        <p className="text-[50px] font-bold">Todo를 찾을 수 없습니다.</p>
      </div>
    );

  return (
    <>
      <div className="flex justify-center min-h-screen">
        <div className="flex flex-col relative w-[1200px] h-[700px] items-center px-4 mt-12">
          {/* TODO NAME */}
          <div className="w-[996px] h-[64px] flex justify-center items-center gap-2 border-2 bg-white border-black rounded-2xl font-bold text-xl">
            <Image
              src={todo.isCompleted ? checkButtonTrue : checkButtonFalse}
              alt={
                todo.isCompleted ? "check-button-true" : "check-button-false"
              }
              className="w-8 h-8 cursor-pointer"
              onClick={() => updateTodo(todo.id, {})}
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="hover:underline cursor-pointer text-center"
              placeholder="todo를 입력하세요."
            />
          </div>
          {/* TODO CONTENT */}
          <div className="flex justify-center items-center w-[996px] h-[350px] mt-[10px] gap-4">
            {/* IMAGE UPLOAD PART */}
            <div className="w-[384px] h-[311px] relative border-dashed border-2 border-slate-500 bg-slate-300 rounded-xl flex justify-center items-center">
              {!imageUrl ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Image src={imgIcon} alt="img-icon" />
                  <button className="absoltue right-5 bottom-5 bg-[#e2e8f0] rounded-full p-4">
                    <Image src={plusIcon} alt="plus-icon" />
                  </button>
                </>
              ) : (
                <>{imageUrl}</>
              )}
            </div>
            {/* MEMO PART */}
            <div className="w-[588px] h-[311px]">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력하세요"
                className="w-full h-full border rounded p-2 text-center align-middle"
                style={{
                  backgroundImage: `url(${memoBg})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>
          <div className="w-[996px] flex justify-end gap-4">
            {!editStatus ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex flex-row justify-center items-center gap-2 bg-slate-200 border-2 text-slate-900 border-black font-bold px-8 py-2 rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)]"
                >
                  <Image src={checkIcon} alt="check-icon" />
                  수정 완료
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex flex-row justify-center items-center gap-2 bg-lime-300 border-2 text-slate-900 border-black font-bold px-8 py-2 rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)]"
                >
                  <Image src={checkIcon} alt="check-icon" />
                  수정 완료
                </button>
              </>
            )}

            <button
              onClick={handleDelete}
              className="flex flex-row justify-center items-center gap-2 bg-rose-500 border-2 border-black text-white font-bold px-8 py-2 rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)]"
            >
              <Image src={XIcon} alt="x-icon" />
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default TodoDetail;
