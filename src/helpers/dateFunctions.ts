export const generateDateToRegister = (): Date => {
  return new Date(new Date().getTime() - 567648000000);
};

export const validateDateToRegister = (date: string): boolean => {
  const dateBorn = new Date(date);
  const time = new Date().getTime() - dateBorn.getTime();
  const years = Math.ceil(time * 3.2 * Math.pow(10, -11));
  return years >= 18;
};
