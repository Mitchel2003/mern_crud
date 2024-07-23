import { hash } from "bcryptjs";

export const encrypt = async (pass: string, salt: number) => {
  const passwordHash = await hash(pass, salt);
  return passwordHash;
}
export const verified = () => { /* await compare() */ }