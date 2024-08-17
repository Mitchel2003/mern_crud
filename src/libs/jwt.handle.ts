import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import CredentialsJWT from "../interfaces/jwt.interface";

/**
 * This create a access token to auth services and protected routes
 * @param token - is the param data to encrypt in the token, can be used in other moment to auth
 * @returns {string} we get a string that correspond to hash token
 */
export async function generateAccessToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (error, token) => {
      if (error) return reject(error);
      resolve(token as string);
    });
  })
}
/**
 * This verify the credentials user { id: Schema.Types.ObjectId } in a token specific
 * @param token - is the token to verify
 * @returns {CredentialsJWT} we get a object with properties like "id" or "exp" correspond to token of user logged
 */
export async function verifyAccessToken(token: string): Promise<CredentialsJWT> {
  if (!token) return { error: 'Token not found, auth denied' };

  try {
    const access = jwt.verify(token, TOKEN_SECRET) as CredentialsJWT;
    if (!access.id) return { error: 'Invalid token' };
    return access
  } catch (e) { return { error: 'Expired token' } }
}