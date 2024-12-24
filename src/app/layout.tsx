import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react"
export const metadata: Metadata = {
  title: {
    default: "华夏中医 - 传承国粹，弘扬中医文化",
    template: "%s | 华夏中医"
  },
  description: "华夏中医网致力于传承和弘扬中医药文化，提供专业的中医药知识和服务。",
};

export default function RootLayout({
  children,
  pageProps: { session, ...pageProps },
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Layout>
          <SessionProvider session={session}>
          {children}
          </SessionProvider>
        </Layout>
      </body>
    </html>
  );
}
