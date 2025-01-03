import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/Layout";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "华夏中医 - 传承国粹，弘扬中医文化",
    template: "%s | 华夏中医"
  },
  description: "华夏中医网致力于传承和弘扬中医药文化，提供专业的中医药知识和服务。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[#FBF6F1]">
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
