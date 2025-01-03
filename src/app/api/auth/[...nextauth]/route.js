import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: "http://localhost:3000/api/auth/callback/github"
    }),
    
    // ...add more providers here
  ],
  // pages: {
  //   signIn: '/login',
  //   error: '/login', // 错误页面
  // },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('jwt', token, user, account)
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          userId: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log('session', session, token)
      session.user.id = token.userId;
      session.accessToken = token.accessToken;
      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };