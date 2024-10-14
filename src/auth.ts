import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { dbConnect } from "./db/dbConnect";
import UserModel from "./model/user";


export const {
    auth,
    handlers: { GET, POST },
    signIn,
    signOut
} = NextAuth({
    ...authConfig,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            async authorize(credentials: any): Promise<any> {

                //connect to database
                await dbConnect();

                //find user by email
                const user = await UserModel.findOne({ $or: [{ email: credentials.identifier }, { username: credentials.identifier }] });

                //if user not found
                if (!user) {
                    throw new Error("User not found")
                }

                //compare password with hashed password
                const isPasswordMatch = await bcryptjs.compare(credentials.password, user.password)

                if (isPasswordMatch) {
                    return user;
                } else {
                    throw new Error("Incorrect password");
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string | undefined;
                session.user.username = token.username as string | undefined;
                session.user.isVerified = token.isVerified as  boolean | undefined;
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean | undefined;
            }
            return session;
        }
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login"
    }
})