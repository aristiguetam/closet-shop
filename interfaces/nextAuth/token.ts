import { User } from "."

export interface NextToken {
    name: string,
    email: string,
    picture: string,
    accessToken: string,
    sub: string,
    iat: number,
    exp: number,
    jti: string
    user: User
  }