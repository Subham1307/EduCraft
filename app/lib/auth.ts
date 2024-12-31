import CredentialsProvider from 'next-auth/providers/credentials';
import { prismaClient } from './db';

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

                if (!user || !(credentials.password != user.password)) {
                    return null; // Return null for invalid credentials
                }

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ user, token }: any) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
        session: ({ session, token }: any) => {
            if (session.user) {
                session.user.id = token.uid
            }
            return session
        }
    },
}