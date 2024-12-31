import CredentialsProvider from 'next-auth/providers/credentials';
import { prismaClient } from './db';
import bcrypt from "bcryptjs";


export const NEXT_AUTH_CONFIG = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'email', type: 'text', placeholder: '' },
                password: { label: 'password', type: 'password', placeholder: '' },
            },
            async authorize(credentials: any) {

                if (!credentials?.email || !credentials.password) {
                    return null; // Return null for invalid credentials
                }

                // Find user in the database
                const user = await prismaClient.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                    throw new Error("Invalid email or password");
                  }
                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.email = user.email;
            token.name = user.name;
    
            // You can add more custom data to the token if needed
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user = {
              id: token.id,
              email: token.email,
              name: token.name,
            };
          }
          return session;
        },
    },
}