import { Request } from "express";

interface ExtendsRequest extends Request { user?: object }

export default ExtendsRequest;