import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * 扩展默认的Session类型
   */
  interface Session {
    user?: {
      id?: string
      createdAt?: string
    } & DefaultSession['user']
  }

  /**
   * 扩展默认的User类型
   */
  interface User {
    id?: string;
    avatar_url?: string;
    email?: string;
  }
}

declare module 'next-auth/jwt' {
  /** 扩展JWT Token类型 */
  interface JWT {
    id?: string
  }
}