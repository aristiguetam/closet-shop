import NextAuth from "next-auth";
import type { NextAuthOptions } from 'next-auth'
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { dbUsers } from "@/database";


export const authOptions: NextAuthOptions = {
  providers: [

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {

        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password) as any
      }
    }),

    // GithubProvider({
    //   clientId: process.env.GITHUB_ID || "",
    //   clientSecret: process.env.GITHUB_SECRET || "",
    // }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  //Custom Pages 

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },


  session: {
    maxAge: 2592000, //30d
    strategy: 'jwt',
    updateAge: 86400, //cada dia
  },


  //Callbacks
  // : { token: NextToken, account: Account, user: NextUser }
  callbacks: {
    async jwt({ token, account, user }) {

      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {

          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user.email as string, user.name as string)
            break;

          case 'credentials':
            token.user = user;
            break;

          default:
            break;
        }
      }

      return token;
    },

    // : { token: NextToken, session: NextSession, user: NextUser }
    async session({ session, token, user }) {
      (session as any).accessToken = token.accessToken
      session.user = token.user as any

      return session;
    }
  }


}

export default NextAuth(authOptions);