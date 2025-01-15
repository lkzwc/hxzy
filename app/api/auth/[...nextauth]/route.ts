import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from '@/lib/prisma'
import crypto from 'crypto';

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "WeChat",
      credentials: {
        openid: { label: "OpenID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.openid) return null;

        // 查找或创建用户
        const user = await prisma.user.upsert({
          where: { openid: credentials.openid },
          update: {
            lastLoginAt: new Date(),
          },
          create: {
            openid: credentials.openid,
            name: `微信用户${crypto.createHash("sha1").update(credentials.openid).digest("hex").slice(0, 6)}`,
            lastLoginAt: new Date(),
          },
        });

        // 返回用户信息，这些信息会被传递给 jwt 回调
        return {
          id: String(user.id), // 转换为字符串
          openid: user.openid,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        // 可以添加其他需要的用户信息
        const user = await prisma.user.findUnique({
          where: { id: Number(token.id) },
        });
        if (user) {
          session.user.name = user.name;
          session.user.image = user.image;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 如果是登录相关的URL，登录成功后重定向到首页
      if (url.startsWith(baseUrl)) {
        return '/'
      }
      // 否则重定向到请求的URL
      return url
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 