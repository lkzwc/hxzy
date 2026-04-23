import "./globals.css";

import Layout from "@/components/Layout";
import { AllProvider } from "./providers";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  metadataBase: new URL("https://hxzy.life"),
  title: {
    default: "华夏中医 - 传承千年智慧，守护健康人生",
    template: "%s | 华夏中医",
  },
  description: "华夏中医是专业的中医药文化传承与创新平台，汇聚中医经典知识，提供智能诊疗工具，打造专业学习社区。涵盖经典医籍、方剂药材、经络穴位、名医医案等内容。",
  keywords: ["中医", "中药", "养生", "健康", "传统医学", "黄帝内经", "本草纲目", "经络穴位", "方剂", "中医诊疗"],
  authors: [{ name: "华夏中医" }],
  creator: "华夏中医",
  publisher: "华夏中医",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://hxzy.life",
    siteName: "华夏中医",
    title: "华夏中医 - 传承千年智慧，守护健康人生",
    description: "专业的中医药文化传承与创新平台，汇聚中医经典知识，提供智能诊疗工具",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "华夏中医",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "华夏中医 - 传承千年智慧",
    description: "专业的中医药文化传承与创新平台",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8701466885719364"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#b45309" />
      </head>
      <body suppressHydrationWarning>
        <AllProvider>
          <ErrorBoundary>
            <Layout>{children}</Layout>
          </ErrorBoundary>
        </AllProvider>
      </body>
    </html>
  );
}
