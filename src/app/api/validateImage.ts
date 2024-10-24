export const validateImage = (file: File) => {
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  const isValidName = /^[a-zA-Z0-9-_]+$/.test(file.name.split(".")[0]);
  const isValidSize = file.size <= maxSizeInBytes;

  if (!isValidName) {
    throw new Error("파일 이름은 영어만 허용됩니다.");
  }

  if (!isValidSize) {
    throw new Error("파일 크기는 5MB 이하이어야 합니다.");
  }
};
