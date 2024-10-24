export const validateImage = (file: File) => {
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  const isValidName = /^[a-zA-Z0-9-_]+$/.test(file.name.split(".")[0]);
  const isValidSize = file.size <= maxSizeInBytes;

  return isValidName && isValidSize;
};
