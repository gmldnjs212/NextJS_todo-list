"use client";

import { useRouter, useParams } from "next/navigation";
import {
  getTodoDetails,
  updateTodo,
  deleteTodo,
  uploadImage,
} from "../app/api/api";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import checkButtonTrue from "../../public/image/check-button-true.png";
import checkButtonFalse from "../../public/image/check-button-false.png";
import checkIcon from "../../public/image/check.png";
import XIcon from "../../public/image/X.png";
import imgIcon from "../../public/image/imgIcon.png";
import plusIcon from "../../public/image/plus.png";
import memoBg from "../../public/image/memo.png";
import { TTodo } from "@/app/types/types";
import { validateImage } from "@/app/api/validateImage";

const TodoDetail = () => {
  const router = useRouter();
  const { itemId } = useParams();
  const [todo, setTodo] = useState<TTodo | null>(null);
  const [name, setName] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(
    "../../public/image/imgIcon.png"
  );
  const [loading, setLoading] = useState<boolean | null>(true);
  const [editStatus, setEditStatus] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);

  // todo 상세 정보 불러오기
  useEffect(() => {
    const fetchTodoDetails = async () => {
      // 혹시라도 idtemId가 없거나 문자열타입이 아니라면 중단
      if (!itemId || typeof itemId !== "string") return;

      try {
        // id값을 파라미터로하여 상세정보를 받아옴
        const data = await getTodoDetails(itemId);
        // 받아온 값을 각 state에 set하여 상태관리함
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

  // 변경사항이 있는지 체크하는 useEffect
  useEffect(() => {
    // 변경사항이 있다면
    if (todo) {
      const nameCheck = todo.name !== name;
      const memoCheck = todo.memo !== memo;
      const imgCheck = todo.todoImage !== imageUrl && imageUrl !== null;
      // 변경사항 상태관리를 하는 state에 true를 set함
      setEditStatus(nameCheck || memoCheck || imgCheck);
    }
  }, [name, memo, imageUrl]);

  // todo 수정하기
  const handleUpdate = async () => {
    if (!itemId || typeof itemId !== "string") return;

    try {
      // todo의 id와 변경사항들을 api를 통해 보냄
      await updateTodo(itemId, { name, memo, imageUrl });
      // 사용자에게 수정완료를 알리고 메인페이지로 돌아옴
      alert("수정되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // todo 삭제하기
  const handleDelete = async () => {
    if (!itemId || typeof itemId !== "string") return;

    try {
      // todo의 id를 api를 통해 보냄
      await deleteTodo(itemId);
      // 사용자에게 삭제완료를 알리고 메인페이지로 돌아옴
      alert("삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 유효성검증
    // - 영어 파일명만 가능
    // - 5mb 미만의 크기만 가능
    validateImage;

    // 선택한 이미지 미리보기
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImageUrl(reader.result as string); // base64 url로 상태 업데이트
      }
    };

    // 서버로 이미지 전송
    try {
      const response = await uploadImage(file);
      console.log(response);

      const imageURL = response.url; // 서버 응답에서 이미지 url 가져오기
      setImageUrl(imageURL); // 업로드된 이미지 url 상태 업데이트
      console.log("업로드된 이미지 URL:", imageURL);
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
    }
  };

  // 데이터를 읽어오는 중 표시할 컨텐츠
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[700px]">
        <p className="text-[50px] font-bold">Loading...</p>
      </div>
    );

  // 보여줄 todo가 없는 경우 보여줄 컨텐츠
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

          <div className="flex justify-center items-center w-[996px] h-[350px] mt-[10px] gap-4">
            {/* 이미지 영역 */}
            <div className="w-[384px] h-[311px] relative border-dashed border-2 border-slate-500 bg-slate-300 rounded-xl flex justify-center items-center">
              {/* 해당 todo에 이미지url이 없다면 이미지 업로드를 할 수 있는 UI를 보여줌 */}
              {!imageUrl ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInput}
                    className="hidden"
                    onChange={handleImage}
                  />
                  <Image src={imgIcon} alt="img-icon" />
                  <button
                    className="absoltue right-5 bottom-5 bg-[#e2e8f0] rounded-full p-4"
                    onClick={(e) => {
                      e.preventDefault(); // 기본 동작은 방지처리
                      fileInput.current?.click(); // input 클릭 트리거
                    }}
                  >
                    <Image src={plusIcon} alt="plus-icon" />
                  </button>
                </>
              ) : (
                <>
                  {/* 해당 todo에 이미지url이 이미있다면 해당 이미지를 보여줌 */}
                  <Image
                    src={imageUrl}
                    alt="todo-image"
                    width={300}
                    height={300}
                    className="object-fit rounded-xl"
                  />
                </>
              )}
            </div>

            {/* 메모 영역 */}
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

          {/* 수정하기 버튼 */}
          <div className="w-[996px] flex justify-end gap-4">
            {!editStatus ? (
              <>
                {/* 변경사항이 하나도 없다면 수정완료 버튼의 배경색을 흰색으로 유지함 */}
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
                {/* 변경사항이 name, image, memo 중 하나라도 있다면 수정완료 버튼의 색을 변경함 */}
                <button
                  onClick={handleUpdate}
                  className="flex flex-row justify-center items-center gap-2 bg-lime-300 border-2 text-slate-900 border-black font-bold px-8 py-2 rounded-full drop-shadow-[5px_5px_0px_rgba(0,0,0,0.8)]"
                >
                  <Image src={checkIcon} alt="check-icon" />
                  수정 완료
                </button>
              </>
            )}

            {/* 삭제하기 버튼 */}
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
