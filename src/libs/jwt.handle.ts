import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";
import AuthJWT from "../interfaces/jwt.interface";
/**
 * This create a access token to auth services and protected routes
 * @param token - is the param data to encrypt in the token, can be used in other moment to auth
 * @returns {string} we get a string that correspond to hash token
 */
export async function createAccessToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (error, token = '') => {
      if (error) reject(error);
      resolve(token);
    });
  })
}
/**
 * This verify the credentials user { id: string } in a token specific
 * @param token - is the token to verify
 * @returns {AuthJWT} we get a object with properties like "id" or "exp" correspond to token of user logged
 */
export async function verifyAccessToken(token: string): Promise<AuthJWT> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) reject(error);
      resolve(user as AuthJWT);
    })
  })
}