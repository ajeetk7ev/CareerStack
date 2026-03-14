import bcrypt from "bcrypt";

export const hashPassword = async (value: string): Promise<string> => {
  return bcrypt.hash(value, 10);
};

export const comparePassword = async (
  plainText: string,
  hashedValue: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashedValue);
};
