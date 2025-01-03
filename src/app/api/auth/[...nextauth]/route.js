import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import prisma from '@/lib/prisma'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/callback/github"
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      try {
        // 查找或创建用户
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
            lastLogin: new Date(),
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            lastLogin: new Date(),
          },
        });

        // 将数据库用户 ID 添加到 user 对象
        user.id = dbUser.id;
        
        return true;
      } catch (error) {
        console.error('Error saving user to database:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };