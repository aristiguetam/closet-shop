import { NextUser } from "./user"


export interface NextToken {
    name: string,
    email: string,
    picture: string,
    accessToken: string,
    sub: string,
    iat: number,
    exp: number,
    jti: string
    user: NextUser
  }