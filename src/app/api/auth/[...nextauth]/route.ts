import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: 'wechat',
      name: 'WeChat',
      credentials: {
        wechatId: { label: "WechatId", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.wechatId) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { wechatId: credentials.wechatId }
        })

        if (!user) {
          return null
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id
      }
      return session
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
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 