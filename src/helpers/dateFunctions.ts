export const generateDateToRegister = () => {
  return new Date(new Date().getTime() - 567648000000);
};

export const validateDateToRegister = (date: string) => {
  const date_born = new Date(date);
  const time = new Date().getTime() - date_born.getTime();
  const years = Math.ceil(time * 3.2 * Math.pow(10, -11));
  return years >= 18;
};
