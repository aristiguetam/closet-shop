export interface Account {
    provider: string,
    type: 'oauth' | 'credentials',
    providerAccountId: string,
    access_token: string,
    token_type: string,
    scope: string
  }