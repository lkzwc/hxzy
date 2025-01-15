import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      openid?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    openid: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    openid?: string
  }
} 