import { hash, compare } from "bcryptjs";
/**
 * Using "bcryptjs" we try convert a password into hash with a number of rounds (salt)
 * @param pass - correspond to password that user wish validate
 * @param passHash - is the number of rounds in which the password will be hashed.
 * @returns {string} this return the password hashed
 */
export const encrypt = async (pass: string, salt: number): Promise<string> => {
  return await hash(pass, salt);
}
/**
 * Validate if the password writed by the user is correct
 * @param pass - correspond to password that user wish validate
 * @param passHash - is hash and represent the password that we get from database
 * @returns {boolean} this return a boolean
 */
export const verified = async (pass: string, passHash: string = ''): Promise<boolean> => {
  return await compare(pass, passHash);
}
