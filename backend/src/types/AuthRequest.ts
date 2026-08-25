import { Request } from "express";

export interface AuthRequest <
  Params = {},
  ResBody = {},
  ReqBody = {},
  ReqQuery = {}
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: { id: string };
}
