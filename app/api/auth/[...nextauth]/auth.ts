import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // 自定义微信登录
    CredentialsProvider({
      name: "WeChat",
      credentials: {
        openid: { label: "OpenID", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        console.log("credentials", credentials);
        if (credentials?.openid) {
          return {
            id: credentials.openid,
            name: `微信${crypto
              .createHash("sha1")
              .update(credentials.openid)
              .digest("hex")
              .slice(0, 6)}`,
          };
        }

        if (credentials?.email) {
          return {
            id: credentials.email,
            name: `@${credentials.email}`,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn", user, account, profile);

      try {
        // 黑名单
        if ([""].includes(user?.id as string)) return false;

        const userData = {
          name: user.name,
          image: user.image || user.avatar_url,
          email: user.email,
          otherId: user?.id,
          lastLoginAt: new Date(),
        };

        // 使用 upsert 统一处理用户数据
        const dbUser = await prisma.user.upsert({
          where: { otherId: user?.id },
          update: userData,
          create: userData,
        });

        console.log("signIn000", dbUser);

        user.id = String(dbUser.id);

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // 确保session.user.id是字符串类型
        session.user.id = token.id ? String(token.id) : undefined;
        // 可以添加其他需要的用户信息
        if (token.id) {
          const user = await prisma.user.findUnique({
            where: { id: Number(token.id) },
          });
          if (user) {
            session.user.name = user.name;
            session.user.image = user.image;
          }
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 如果是登录相关的URL，登录成功后重定向到首页
      if (url.startsWith(baseUrl)) {
        return "/community";
      }
      // 否则重定向到请求的URL
      return url;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
};
