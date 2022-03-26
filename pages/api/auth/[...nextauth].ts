import NextAuth, { Session } from 'next-auth';
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import EmailProvider from 'next-auth/providers/email';

const isProduction = process.env.APP_ENV == "prod";
export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: (isProduction ? process.env.GOOGLE_PRODUCTION_KEY : process.env.GOOGLE_KEY) || "",
            clientSecret: (isProduction ? process.env.GOOGLE_PRODUCTION_SECRET : process.env.GOOGLE_SECRET) || ""
        }),
        EmailProvider({
            server: {
                service: "Gmail",
                auth: {
                    user: "a.caleb.wilson@gmail.com",
                    pass: "espndiwqfcwfkdgd"
                }
            },
            from: process.env.EMAIL_FROM
        }),
    ],
    callbacks: {
        // a bit jank but it works
        jwt: async ({ token, user }) => {
            // user && (token.user = { email: user.email, id: user.id, name: user.name })
            // console.log(token);
            return token
        },
        session: async ({ session, token, user }) => {
            // session.user = (token as Session).user
            // console.log("hello there", session, token, user);
            return {...session, user} as Session
        }
    },
    events: {
      signIn: (message) => {
          console.log(message);
      }  
    },
    secret: process.env.SECRET
})