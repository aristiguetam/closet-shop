export interface NextSession {
    accessToken: string,
    user: {
      name: string,
      email: string,
      image?: string
    },
    expires: string
  }