import NextAuth, { Session } from 'next-auth';
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_KEY || "",
            clientSecret: process.env.GOOGLE_SECRET || ""
        })
        // CredentialsProvider({
        //     name: "Credentials",
        //     credentials: {
        //         email: { label: "Email", type: "text", placeholder: "example@example.com" },
        //         password: { label: "Password", type: "password" }
        //     },
        //     async authorize(credentials, req) {
        //         if (!credentials) {
        //             return null;
        //         }
        //         const user = await prisma.user.findUnique({where: { email: credentials.email }})
        //         if (user) {
        //             console.log(user);
        //             return user;
        //         }
        //         return null;
        //     }
        // })
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
    }
})