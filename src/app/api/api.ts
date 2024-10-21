import axios from "axios";

// 기본 Axios 인스턴스 설정
const API_BASE_URL =
  "https://assignment-todolist-api.vercel.app/api/gmldnjs212";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// todo 목록 조회
export const getTodos = async () => {
  const response = await api.get("/items");
  return response.data;
};

// todo 추가
export const createTodo = async (name: string) => {
  const response = await api.post("/items", { name });
  return response.data;
};

// todo 수정
export const updateTodo = async (
  itemId: string,
  data: {
    name?: string;
    memo?: string;
    isCompleted?: boolean;
    imageUrl?: string;
  }
) => {
  const response = await api.patch(`/items/${itemId}`, data);
  return response.data;
};

// todo 삭제
export const deleteTodo = async (itemId: string) => {
  await api.delete(`/items/${itemId}`);
};

// todo 상세 조회
export const getTodoDetails = async (itemId: string) => {
  const response = await api.get(`/items/${itemId}`);
  return response.data;
};

// 이미지 업로드
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export default api;
