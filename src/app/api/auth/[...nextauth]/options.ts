import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/lib/dbConnect";
import UserModel from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(creadentials: any): Promise<any> {
                await dbConnect();
                try {
                    const{identifier, password} = creadentials;
                    const user = await UserModel.findOne({
                        $or: [
                            {email: identifier},
                            {username: identifier}
                        ]
                    });

                    if(!user){
                        throw new Error("No user found with these credentials")
                    }

                    if(!user.isVerified){
                        throw new Error("User is not verified")
                    }

                    const isValidPassword = bcrypt.compare(password, user.password);
                    
                    if(!isValidPassword){
                        throw new Error("Incorrect Password");
                    }

                    return user;
                    
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })

    ],

    callbacks: {
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
            }
            return token;
        },

        async session({session, token}){
            if(token){
                session.user._id = token.id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                
            }
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    }

}
