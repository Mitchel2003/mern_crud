import jwt from "jsonwebtoken";
import { Response } from "express";
import { TOKEN_SECRET } from "../config";
import CredentialsJWT from "../interfaces/jwt.interface";

/**
 * This create a access token to auth services and protected routes
 * @param token - is the param data to encrypt in the token, can be used in other moment to auth
 * @returns {string} we get a string that correspond to hash token
 */
export async function generateAccessToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (error, token = '') => {
      if (error) reject(error);
      resolve(token);
    });
  })
}
/**
 * This verify the credentials user { id: Schema.Types.ObjectId } in a token specific
 * @param token - is the token to verify
 * @returns {CredentialsJWT} we get a object with properties like "id" or "exp" correspond to token of user logged
 */
export async function verifyAccessToken(token: string, res: Response): Promise<CredentialsJWT> {
  return new Promise((resolve) => {
    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) return res.status(401).json({ message: "Token expired" });//check expiration
      const token = user as CredentialsJWT;//convert to use credentials
      if (!token.id) return res.status(401).json({ message: "Invalid token" });
      resolve(token);
    })
  })
}
