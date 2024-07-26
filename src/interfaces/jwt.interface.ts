import { JwtPayload } from "jsonwebtoken";

interface AuthJWT extends JwtPayload { id?: string }

export default AuthJWT;