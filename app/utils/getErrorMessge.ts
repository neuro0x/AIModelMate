export const getErrorMessage = (error: any) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.response ||
    error
  );
};
