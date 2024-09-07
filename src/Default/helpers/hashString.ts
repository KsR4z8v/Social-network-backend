import bcrypt from "bcryptjs";

export const hashString = async (text: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(text, salt);
};
