import { JwtPayload } from "jsonwebtoken";
import { Schema } from "mongoose";

interface CredentialsJWT extends JwtPayload { id?: Schema.Types.ObjectId, error?: string }

export default CredentialsJWT;