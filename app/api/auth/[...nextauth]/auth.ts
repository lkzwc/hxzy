import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { verifyLoginAndGetOpenid } from "@/lib/wechatLoginState";


// 前端提交微信凭证 → authorize验证 → 返回用户对象
// 触发signIn → 数据同步/黑名单检查 → 生成JWT令牌
// 构建会话 → 返回登录态 → 客户端存储‌3

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // 自定义微信登录
    CredentialsProvider({
      name: "WeChat",
      credentials: {
        openid: { label: "OpenID", type: "text" },
        loginToken: { label: "LoginToken", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        // 微信登录：必须提供 loginToken 进行服务端验证
        if (credentials?.openid && credentials?.loginToken) {
          // 通过共享登录状态模块验证 loginToken 的真实性
          const verifiedOpenid = verifyLoginAndGetOpenid(credentials.loginToken);

          if (!verifiedOpenid) {
            console.error("微信登录验证失败：loginToken 无效或已过期");
            return null;
          }

          // 验证 openid 与 loginToken 绑定的一致
          if (verifiedOpenid !== credentials.openid) {
            console.error("微信登录验证失败：openid 不匹配");
            return null;
          }

          return {
            id: verifiedOpenid,
            name: `微信${crypto
              .createHash("sha1")
              .update(verifiedOpenid)
              .digest("hex")
              .slice(0, 6)}`,
          };
        }

        // 邮箱登录
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
      try {
        // 黑名单检查（在此处添加需要封禁的用户 ID）
        const blacklist: string[] = [];
        if (blacklist.includes(user?.id as string)) return false;

        const userData = {
          name: user.name,
          image: (user as any).image || (user as any).avatar_url,
          email: user.email,
          otherId: user?.id,
          lastLoginAt: new Date(),
        };

        // 使用 upsert 统一处理用户数据
        const dbUser = await prisma.user.upsert({
          where: { otherId: user?.id },
          update: userData,
          create: {...userData, createdAt: new Date()},
        });

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
        // 从数据库获取最新用户信息
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
