import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github";
import {compare} from "bcrypt";
import {PrismaClient, User} from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60,
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: {
                    type: 'email',
                    label: 'Email',
                    placeholder: 'hello@example.com',
                },
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user?.password) return null;

                const isValid = await compare(credentials.password, user.password);
                return isValid ? { id: user.id, email: user.email } : null;
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: "read:user user:email",
                },
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: ({session, token}) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.id = (user as unknown as User).id;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };