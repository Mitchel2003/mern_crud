import { hash, compare } from "bcryptjs";

/**
 *
 *
 *
 */
export const encrypt = async (pass: string, salt: number): Promise<string> => {
  return await hash(pass, salt);
}

/**
 *
 *
 *
 *
 */
export const verified = async (pass: string, passHash: string = 'false'): Promise<boolean> => {
  return await compare(pass, passHash);
}
