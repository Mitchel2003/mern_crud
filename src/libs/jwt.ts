import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET } from "../config";

export async function createAccessToken(payload: object) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (error, token) => {
      if (error) reject(error);
      resolve(token);
    });
  })
}
/**
 * This verify the credentials user { id: string } in a token specific
 * @param token - is the token to verify
 * @returns {JwtPayload} we get a object with properties like "id" or "exp" correspond to user logged
 */
export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) reject(error);
      resolve(user as JwtPayload);
    })
  })
}